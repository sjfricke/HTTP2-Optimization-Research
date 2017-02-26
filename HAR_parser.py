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


def parse_har(file_path):

    with open(file_path) as data_file:
        data = json.load(data_file)

    """ Website Table Fields """
    domain = file_path
    NumberOfFiles = 0
    RequestedOrder = 'NONE'  # TODO How to determine Request Order?
    FirstLoad = True  # Check cache of all files, if always empty, its first load

    """ Request Table Fields"""
    # url = ''
    # blocked = 0
    # dns = 0
    # connect = 0
    # send = 0
    # wait = 0
    # receive = 0
    # ssl = 0

    log = data['log']
    entries = data['log']['entries']

    # Array of requests to insert into DB
    requests_for_sql = []
    NumberOfFiles = len(entries)

    # Iterate through entries
    for entry in entries:

        # Is Request Cahced
        cached = entry['cache']
        if len(cached):
            FirstLoad = False  # Something found in cache

        # Get Request Info
        request = entry['request']
        url = request['url']

        # Get Timings
        timings = entry['timings']
        blocked = timings['blocked']
        dns = timings['dns']
        connect = timings['connect']
        send = timings['send']
        wait = timings['wait']
        receive = timings['receive']
        ssl = timings['ssl']

        # Create request object and add list

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
        # Website Table Entry
        # INSERT INTO har_db Website('Domain', 'NumberOfFiles' , 'RequestOrder', 'FirstLoad')domain = ''
        # NumberOfFiles = 0
        # RequestedOrder = ''
        # FirstLoad = False

        # INSERT

        for request in requests_for_sql:
            print 'inserting request'

    except Error as e:
        print(e)

    finally:
        conn.close()

    print "Parsed File Successfully"

if __name__ == '__main__':

    # Get File and Parse JSON
    # TODO Load file from command line
    cur_path = os.path.dirname(__file__)
    #file_path = os.path.relpath('HAR_test_files/example.com.har', cur_path)
    file_path = os.path.relpath('HAR_test_files/www.facebook.com.har', cur_path)
    parse_har(file_path)