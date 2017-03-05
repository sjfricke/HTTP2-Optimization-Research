import json
import mysql.connector
import os
from mysql.connector import Error
import sys


""" REQUEST OBJECT"""


class Request:
    requestCount = 0

    def __init__(self, domain, url,blocked,dns,connect,send,wait, receive, ssl, requestHeadersSize,
                 requestBodySize, responseHeadersSize, responseBodySize, responseStatus, responseTransferSize,
                 contentType):
        self.domain = domain
        self.url = url
        self.blocked = blocked
        self.dns = dns
        self.connect = connect
        self.send = send
        self.wait = wait
        self.receive = receive
        self.ssl = ssl
        self.requestHeadersSize = requestHeadersSize
        self.requestBodySize = requestBodySize
        self.responseHeadersSize = responseHeadersSize
        self.responseBodySize = responseBodySize
        self.responseStatus = responseStatus
        self.responseTransferSize = responseTransferSize
        self.contentType = contentType

        Request.requestCount += 1

    def get_total_requests(self):
        return Request.requestCount

""" HAR PARSER """


def parse_har(domain):

    with open(domain) as data_file:
        data = json.load(data_file)

    """ Website Table Fields """
    domain = ''
    NumberOfFiles = 0
    FirstLoad = True
    OnContentLoad = 0
    OnLoad = 0

    #file name = 2, request order = 3
    if len(sys.argv) == 3:
        RequestOrder = sys.argv[2]

    """ Entries  Table Fields"""
    # url = ''
    # blocked = 0
    # dns = 0
    # connect = 0
    # send = 0
    # wait = 0
    # receive = 0
    # ssl = 0
    # requestHeaderSize
    # requestBodySize
    # responseBodySize
    # responseStatus
    # responseTransferSize
    # contentType
    entries = data['log']['entries']

    # Array of requests to insert into DB
    requests_for_sql = []
    domain = data['log']['pages'][0]['title']
    NumberOfFiles = len(entries)
    OnContentLoad = data['log']['pages'][0]['pageTimings']['onContentLoad']
    OnLoad = data['log']['pages'][0]['pageTimings']['onLoad']


    # Iterate through entries/files downloaded
    for entry in entries:

        # Is request cached
        cached = entry['cache']
        if len(cached):
            FirstLoad = False  # Something found in cache

        # Get Request URL
        url = entry['request']['url']

        # Get Timings
        timings = entry['timings']
        blocked = timings['blocked']
        dns = timings['dns']
        connect = timings['connect']
        send = timings['send']
        wait = timings['wait']
        receive = timings['receive']
        ssl = timings['ssl']

        ## Request Info
        requestHeaderSize = entry['request']['headersSize']
        requestBodySize = entry['request']['bodySize']

        ## Response Info
        responseHeadersSize = entry['response']['headersSize']
        responseBodySize = entry['response']['bodySize']
        responseStatus = entry['response']['status']
        responseTransferSize = entry['response']['_transferSize'] # TODO Check if this is also in SCRIPT_har
        contentType = ''
        for i in entry['response']['headers']:
            if i['name'] == 'content-type':
                contentType = i['value']

        # Create request object and add to list
        req = Request(domain, url, blocked, dns, connect, send,  wait, receive, ssl, requestHeaderSize, requestBodySize,
                      responseHeadersSize, responseBodySize, responseStatus, responseTransferSize, contentType)
        requests_for_sql.append(req)

    print 'Done Parsing HAR File'

    """ Connect and INSERT to MySQL database """

    try:
        print 'Connecting to DB'
        conn = mysql.connector.connect(host='127.0.0.1',
                                       database='har_db',
                                       user='',
                                       password='')
        if conn.is_connected():
            print('Connected to MySQL database')

        """Inserting Into DB"""
        print 'Inserting into DB'

        cursor = conn.cursor()

        ''' Insert Info into Website Table '''
        website_query = "INSERT INTO Website(Domain, NumberOfFiles, RequestOrder, FirstLoad , OnContentLoad, OnLoad ) " \
                        "VALUES(%s, %s, %s, %s, %s, %s)"

        args = (domain, NumberOfFiles, RequestOrder, FirstLoad, OnContentLoad, OnLoad)
        cursor.execute(website_query, args)
        if cursor.lastrowid:
            print('last insert id', cursor.lastrowid)
        else:
            print('last insert id not found')
        conn.commit()
        print 'Finished inserting into Website'

        ''' Insert requests into Request Table'''
        request_query = "INSERT INTO Entries(Domain, Url, Blocked, DNS, Connected, Send, Wait, Receive, SSL_time, " \
                        "RequestHeaderSize, RequestBodySize, ResponseHeaderSize, ResponseBodySize, ResponseStatus," \
                        "ResponseTransferSize, ContentType) " \
                        "VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s)"
        count = 1
        for request in requests_for_sql:
            url = request.url
            blocked = request.blocked
            dns = request.dns
            connect = request.connect
            send = request.send
            wait = request.wait
            receive = request.receive
            ssl = request.ssl

            args = (domain, url, blocked, dns, connect, send, wait, receive, ssl)
            cursor.execute(request_query, args)
            print 'Inserting Request: ', count, ' ', url
            count += 1
            conn.commit()

    except Error as e:
        print(e)

    finally:
        conn.close()
        cursor.close()

    print "Parsed File Successfully"

if __name__ == '__main__':

    # Get File and Parse JSON
    cur_path = os.path.dirname(__file__)
    fileName = sys.argv[1]
    domain = os.path.relpath(fileName, cur_path)
    parse_har(domain)
