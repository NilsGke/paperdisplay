from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.job import Job
from app.display import set_image
from typing import List
from datetime import datetime

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


def schedule_image(hour: int, minute: int, image_name: str, days: List[bool]):
  scheduled_images.append(Scheduled_Image(image_name, hour, minute, days))
  print(f"ADDED schedule for {image_name} at {hour}:{minute} for days: monday={days[0]}, tuesday={days[1]}, wednesday={days[2]}, thursday={days[3]}, friday={days[4]}, saturday={days[5]}, sunday={days[6]}")

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
  print(f"REMOVED schedule for {scheduled.image_name} at {scheduled.hour}:{scheduled.minute} for days: monday={scheduled.days[0]}, tuesday={scheduled.days[1]}, wednesday={scheduled.days[2]}, thursday={scheduled.days[3]}, friday={scheduled.days[4]}, saturday={scheduled.days[5]}, sunday={scheduled.days[6]}")

def edit_schedule(job_id:str, hour: int, minute: int, image_name: str, days: List[bool]):
  scheduled: Scheduled_Image = None
  for s in scheduled_images:
    if(s.job.id == job_id):
      scheduled = s
      break
    
  if(scheduled == None): raise Exception(f"job not found (job_id: {job_id})")
  
  scheduled.edit(hour, minute, days, image_name)
  print(f"edited schedule for: {image_name} to {hour}:{minute} days: monday={days[0]}, tuesday={days[1]}, wednesday={days[2]}, thursday={days[3]}, friday={days[4]}, saturday={days[5]}, sunday={days[6]}")