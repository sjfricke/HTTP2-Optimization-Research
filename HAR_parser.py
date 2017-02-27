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

    def get_domain(self):
        return self.domain

    def get_url(self):
        return self.url

    def get_blocked(self):
        return self.blocked

    def get_dns(self):
        return self.dns

    def get_connect(self):
        return self.connect

    def get_send(self):
        return self.send

    def get_wait(self):
        return self.wait

    def get_receive(self):
        return self.receive

    def get_ssl(self):
        return self.ssl

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
        website_query = "INSERT INTO Website(Domain, NumberOfFiles, RequestOrder, FirstLoad ) " \
                        "VALUES(%s,%s,%s,%s)"

        args = (domain, NumberOfFiles, RequestOrder, FirstLoad)
        cursor.execute(website_query, args)
        if cursor.lastrowid:
            print('last insert id', cursor.lastrowid)
        else:
            print('last insert id not found')
        conn.commit()

        ''' Insert requests into Request Table'''
        request_query = "INSERT INTO Request(Domain,RequestURL,Blocked,DNS,Connect,Send,Wait,Receive,SSL) " \
                        "VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,)"

        for request in requests_for_sql:
            args = (domain, request.get_url, request.get_blocked(),
                    request.get_dns(), request.get_connect(), request.get_send(),
                    request.get_wait(), request.get_receive(), request.get_ssl())
            cursor.execute(request_query, args)
            print 'Inserting Request: ', request.get_url()
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
    #file_path = os.path.relpath('HAR_test_files/example.com.har', cur_path)
    domain = os.path.relpath('HAR_test_files/www.facebook.com.har', cur_path)
    parse_har(domain)
