import requests
import pandas
import json
import os

##################
UPDATE_JSON = True
REQUIRE_WAGE = True
##################

if (not os.path.exists("jobdata/jobdata.json")) or (os.path.exists("jobdata/jobdata.json") and UPDATE_JSON):
    print("SENDING REQUESTS TO API...\n")

    PASSKEY = os.environ.get("PASSKEY") # stored in local environment (.zprofile)
    base_url = "https://tnrp-api.gartner.com/wantedapi/v5.0/jobs?passkey="+PASSKEY+"&city=st_cloud@mn&responsetype=json&pagesize=100&descriptiontype=long&educationlevel=8"
    response = requests.get(base_url)
    numfound = json.loads(response.text)['response']['numfound']
    last_page =  -(-int(numfound) // 100) # ceiling division of numfound by 100

    jobs = []
    for page in list(range(1,last_page+1)):
        response = requests.get(base_url+"&pageindex="+str(page))
        json_data = json.loads(response.text)
        jobs_from_json = json_data['response']['jobs']['job']
        jobs += jobs_from_json

    with open("jobdata/jobdata.json", "w") as outfile:
        json.dump(jobs, outfile)
    print("jobdata.json file saved.\n")

with open("jobdata/jobdata.json") as json_file:
    jobs = json.load(json_file)

columns = ['Title',
           'Company',
           'Talking',
           'Cleaning',
           'Food',
           'Building',
           'Organizing',
           'Computers',
           'Numbers',
           'Translating',
           'Machinery',
           'Description',
           'Wage',
           'Link']

tags = columns[2:11]

tag_dict = {'Talking':{"talking", "oral", "social", "communication", "communicate"},
            'Cleaning':{"cleaning", "steril", "sanitation", "janitor"},
            'Food':{"food", "cook", "culinary", "sandwich"},
            'Building':{"construction", "weld", "cabinet"},
            'Organizing':{"clerk", "office", "organize", "organizing", "organization", "shopping", "warehouse", "retail", "file", "orderly"},
            'Computers':{"microsoft", "computer", "technology", "tech", "technologist"},
            'Numbers':{"math", "numbers", "counting"},
            'Translating':{"translator", "language", "translation", "translating", "somali", "interpreter"},
            'Machinery':{"operate", "operating", "assembly", "assembling", "assemble", "machine", "machinery", "metal", "operator"}}

tag_dict_plural = {}
for tag in tags:
    tag_dict_plural[tag] = {word+"s" for word in tag_dict[tag]}

C = {}
for i in columns:
    C[i] = []

print("EXTRACTING DATA...\n")
count = 0
tot = len(jobs)
for job in jobs:

    # convert salaries (both posted and modeled) to wages
    if (job["salaries"]["salary"][0]["type"] == "Posted") and (6 < round(int(job["salaries"]["salary"][0]["value"]) / 2080) < 40):
        C['Wage'].append("$" + str(round(int(job["salaries"]["salary"][0]["value"]) / 2080)))
        count += 1
    elif (job["salaries"]["salary"][0]["type"] == "Modeled") and (6 < round(int(job["salaries"]["salary"][0]["value"]) / 2080) < 40):
        C['Wage'].append("~$" + str(round(int(job["salaries"]["salary"][0]["value"]) / 2080)))
        count += 1
    else:
        if REQUIRE_WAGE:
            continue # do not add job to C
        else:
            C['Wage'].append("$?")

    # shorten title
    if len(job["title"]["value"]) > 24:
        C['Title'].append(job["title"]["value"][:24] + "...")
    else:
        C['Title'].append(job["title"]["value"])

    # shorten description
    if len(job['description']['value']) > 297:
        C['Description'].append(job['description']['value'][:297] + "...")
    else:
        C['Description'].append(job['description']['value'])

    if job["employer"]["name"] == "":
        C['Company'].append("__?__")
    else:
        C['Company'].append(job["employer"]["name"])

    C['Link'].append(job["sources"]["source"][0]["url"])

    # assign tags to match with interests
    tokenized_desc = set(job['description']['value'].split())
    for tag in tags:
        if len(tag_dict[tag].intersection(tokenized_desc)) + len(tag_dict_plural[tag].intersection(tokenized_desc)) > 0:
            C[tag].append("X")
        else:
            C[tag].append("")

print("CONVERTING TO CSV...\n")
df = pandas.DataFrame(C, columns=columns)
export_csv = df.to_csv (r'jobdata/final.csv', header=True)
print("DONE.\n")
