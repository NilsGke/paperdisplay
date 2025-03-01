import os
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.job import Job
from app.display import set_image
from typing import List
from datetime import datetime
import csv
from app.config import IMAGES_DIR
from typing import TypeVar
from app.colors import colors


scheduler = BackgroundScheduler()
scheduler.start()

class Scheduled_Image:
  def __init__(self, image_name: str, hour: int, minute: int, days: List[bool]):
    self.image_name = image_name
    self.hour = hour
    self.minute = minute
    self.days = days
    self.job: Job = scheduler.add_job(self.run, 'cron', hour=self.hour, minute=self.minute)
  
  
  def run(self):
    weekday = datetime.now().weekday()
    should_run_today = self.days[weekday]
    if(should_run_today):
      jsonResult, status = set_image(self.image_name)
      if(status == 200): 
        print(f"applied {self.image_name} as scheduled")
      else: print(f"error while applying scheduled image:\n{jsonResult}")
    
  
  def remove(self):
    scheduler.remove_job(self.job.id)
    scheduled_images.remove(self)
    
  def serialize(self):
    return {
      "id": self.job.id,
      "hour": self.hour,
      "minute": self.minute,
      "imageName": self.image_name,
      "days": [
        self.days[0],
        self.days[1],
        self.days[2],
        self.days[3],
        self.days[4],
        self.days[5],
        self.days[6],
      ]
    }

  def edit(self, hour: int, minute: int, days: List[bool], image_name):
    self.job.reschedule(trigger='cron', hour=hour, minute=minute)
    self.hour = hour
    self.minute = minute
    self.days = days
    self.image_name = image_name


scheduled_images: List[Scheduled_Image] = []
SCHEDULES_FILE = IMAGES_DIR + "/schedules.csv"


def schedule_image(hour: int, minute: int, image_name: str, days: List[bool], write_to_file = True):
  new_scheduled_image = Scheduled_Image(image_name, hour, minute, days);
  scheduled_images.append(new_scheduled_image)
  if write_to_file: add_to_file(new_scheduled_image)
  print(f"{colors.fg.yellow}ADDED schedule for {image_name} at {hour}:{minute} for days: monday={days[0]}, tuesday={days[1]}, wednesday={days[2]}, thursday={days[3]}, friday={days[4]}, saturday={days[5]}, sunday={days[6]}{colors.reset}")

def get_schedules():
  serialized_scheduled = []
  for scheduled in scheduled_images:
    serialized_scheduled.append(scheduled.serialize())
    
  return serialized_scheduled

def remove_schedule(job_id: str): 
  scheduled: Scheduled_Image = None
  for s in scheduled_images:
    if(s.job.id == job_id):
      scheduled = s
      break
  
  if(scheduled == None): 
    raise Exception(f"job not found! (id: {job_id})")
  
  scheduled.remove()
  rewrite_file()
  print(f"{colors.fg.yellow}REMOVED schedule for {scheduled.image_name} at {scheduled.hour}:{scheduled.minute} for days: monday={scheduled.days[0]}, tuesday={scheduled.days[1]}, wednesday={scheduled.days[2]}, thursday={scheduled.days[3]}, friday={scheduled.days[4]}, saturday={scheduled.days[5]}, sunday={scheduled.days[6]}{colors.reset}")

def edit_schedule(job_id:str, hour: int, minute: int, image_name: str, days: List[bool]):
  scheduled: Scheduled_Image = None
  for s in scheduled_images:
    if(s.job.id == job_id):
      scheduled = s
      break
    
  if(scheduled == None): raise Exception(f"job not found (job_id: {job_id})")
  
  scheduled.edit(hour, minute, days, image_name)
  
  rewrite_file()
  print(f"{colors.fg.yellow}edited schedule for: {image_name} to {hour}:{minute} days: monday={days[0]}, tuesday={days[1]}, wednesday={days[2]}, thursday={days[3]}, friday={days[4]}, saturday={days[5]}, sunday={days[6]}{colors.reset}")


def load_from_file():
  if not os.path.exists(SCHEDULES_FILE):
    print(f"{colors.fg.orange}schedules.csv does not exist{colors.reset}")
    open(SCHEDULES_FILE, "x")
    print(f"{colors.fg.green}created \"schedules.csv\"{colors.reset}")
    return
  
  print(f"{colors.fg.cyan}loding schedules from file:")
  with open(SCHEDULES_FILE, "r") as f:
    reader = csv.reader(f)
    for row in reader:
      hour = int(get_index_or_default(row, 0, 0))
      minute = int(get_index_or_default(row, 1, 0))
      image_name = get_index_or_default(row, 2, "undefined")
      mo = get_index_or_default(row, 3, "False") == "True"
      tu = get_index_or_default(row, 4, "False") == "True"
      we = get_index_or_default(row, 5, "False") == "True"
      th = get_index_or_default(row, 6, "False") == "True"
      fr = get_index_or_default(row, 7, "False") == "True"
      sa = get_index_or_default(row, 8, "False") == "True"
      su = get_index_or_default(row, 9, "False") == "True"
      
      print("- ", end="")
      schedule_image(hour, minute, image_name, [mo, tu, we, th, fr, sa, su], write_to_file=False)
  print(f"one loading from file{colors.reset}\n")

def add_to_file(s: Scheduled_Image):
  with open(SCHEDULES_FILE, "a") as file: 
    writer = csv.writer(file)
    writer.writerow([s.hour, s.minute, s.image_name, *s.days])

def rewrite_file():
  rows = []
  for s in scheduled_images:
    rows.append([s.hour, s.minute, s.image_name, *s.days])

  # And then use the following to create the csv file:
  with open(SCHEDULES_FILE, 'w', newline='') as file:
      writer = csv.writer(file)
      writer.writerows(rows)

T = TypeVar('T') 
def get_index_or_default(list: List[T], index: int, default: T):
  elm = default
  try:
    elm = list[index]
  finally:
    return elm
    

load_from_file()
  