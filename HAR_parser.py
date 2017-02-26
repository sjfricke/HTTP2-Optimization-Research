import json
import mysql.connector
import os
import array


from mysql.connector import Error


def parse_har(file_path):


    with open(file_path) as data_file:
        data = json.load(data_file)

    """ Website Table Fields """
    domain = ''
    NumberOfFiles = 0
    RequestedOrder = ''
    FirstLoad = False

    """ Request Table Fields"""
    url = ''
    blocked = 0
    dns = 0
    connect = 0
    send = 0
    wait = 0
    receive = 0
    ssl = 0

    # PARSING FILE


    log = data['log']
    entries = data['log']['entries']

    entriesForSQL = []

    #Iterate through entries
    for entry in entries:
        timings = entry['timings']

        print 'test'


    # Inserting into DB

    """ Connect to MySQL database """
    try:
        conn = mysql.connector.connect(host='127.0.0.1',
                                       database='har_db',
                                       user='',
                                       password='')
        if conn.is_connected():
            print('Connected to MySQL database')

        """Inserting Into DB"""

    except Error as e:
        print(e)

    finally:
        conn.close()

    print "Parsed File Succesfully"

if __name__ == '__main__':

    #Get File and Parse JSON
    cur_path = os.path.dirname(__file__)
    file_path = os.path.relpath('HAR_test_files/example.com.har', cur_path)
    parse_har(file_path)


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

    def getDomain(self):
        return self.domain

    def getUrl(self):
        return self.url

    def getBlocked(self):
        return self.blocked

    def getDns(self):
        return self.dns

    def getConnect(self):
        return self.connect;

    def getSend(self):
        return self.send

    def getWait(self):
        return self.wait

    def getReceive(self):
        return self.receive

    def getSsl(self):
        return self.ssl
