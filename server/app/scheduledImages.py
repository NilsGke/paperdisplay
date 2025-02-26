from apscheduler.schedulers.background import BackgroundScheduler
from app.display import set_image

scheduler = BackgroundScheduler()
scheduler.start()

def schedule_image(hour: int, minute: int, image_name: str):

  # Schedule the job
  scheduler.add_job(set_image, 'cron', args=[image_name], hour=hour, minute=minute)
  print(f"scheduled job at {hour}:{minute}")

def get_schedules():
  
  jobs = scheduler.get_jobs()
  serialized_jobs = []
  for job in jobs:
    serialized_jobs.append(serialize_job(job))
    
  return serialized_jobs

def remove_schedule(job_id: str): 
  job = scheduler.get_job(job_id)
  
  if(job == None): 
    raise Exception(f"job not found! (id: {job_id})")
  
  scheduler.remove_job(job_id)
  
  
def serialize_job(job):
  return {
    'id': job.id,
    'name': job.name,
    'next_run_time': job.next_run_time.isoformat() if job.next_run_time else None,
    'args': job.args,
    'kwargs': job.kwargs,
    'misfire_grace_time': job.misfire_grace_time,
    'max_instances': job.max_instances,
  }