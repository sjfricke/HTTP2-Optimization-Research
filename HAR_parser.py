import json
import mysql.connector
import os
from mysql.connector import Error


""" REQUEST OBJECT"""


class Request:
    requestCount = 0

    def __init__(self, domain, url,blocked,dns,connect,send,wait, receive, ssl):
        self.domain = domain
        self.url = url
        self.blocked = blocked
        self.dns = dns
        self.connect = connect
        self.send = send
        self.wait = wait
        self.receive = receive
        self.ssl = ssl
        Request.requestCount += 1

    def get_total_requests(self):
        return Request.requestCount

""" HAR PARSER """


def parse_har(domain):

    with open(domain) as data_file:
        data = json.load(data_file)

    """ Website Table Fields """
    domain = domain
    NumberOfFiles = 0
    RequestOrder = 'NONE'  # TODO How to determine Request Order?
    FirstLoad = True
    OnContentLoad = 0
    OnLoad = 0

    """ Request Table Fields"""
    # url = ''
    # blocked = 0
    # dns = 0
    # connect = 0
    # send = 0
    # wait = 0
    # receive = 0
    # ssl = 0

    entries = data['log']['entries']

    # Array of requests to insert into DB
    requests_for_sql = []
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

        # Create request object and add to list
        req = Request(domain, url, blocked, dns, connect, send,  wait, receive, ssl)
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
        request_query = "INSERT INTO Request(Domain, RequestURL, Blocked, DNS, Connected, Send, Wait, Receive, SSL) " \
                        "VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s)"

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
            print 'Inserting Request: ', url
            conn.commit()

    except Error as e:
        print(e)

    finally:
        conn.close()
        cursor.close()

    print "Parsed File Successfully"

if __name__ == '__main__':

    # Get File and Parse JSON
    # TODO Load file from command line
    cur_path = os.path.dirname(__file__)
    domain = os.path.relpath('HAR_test_files/www.facebook.com.har', cur_path)
    parse_har(domain)
