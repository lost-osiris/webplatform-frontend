import React from 'react'

const FormInfo = () => {
  return (
    <div className="card">
      <div className="card-header bgm-gray c-white">
        <h4
          style={{
            color: 'white',
          }}
        >
          Info
        </h4>
      </div>
      <div className="card-body card-padding">
        <h4>Welcome to the Job Runner!</h4>
        <p>
          Here you can create or edit a job to run on the dedicated server. Jobs are meant
          either to populate the database with new information or to gather existing data.
          Jobs can be run at a particular time or on regular intervals.
        </p>
        <h4>What do you want to run?</h4>
        <p>
          Select an API for the job to execute using the drop-down menu at the top of the
          form. This is the only information required to create a job.
        </p>
        <div>
          <h4>Should other job admins be able to monitor this job?</h4>
          <p>
            You can make your job accessible to other job admins by toggling
            the <b>Set as an admin job</b> checkbox.
          </p>
        </div>
        <h4>Should this re-occur?</h4>
        <p>
          If you would like the scheduler to regularly rerun your job, you can have it do
          so by clicking the <b>Set an interval</b> checkbox and selecting the desired
          interval (e.g. daily, weekly, etc.).
          Edititionally, you can instruct the scheduler to skip a number of intervals
          between jobs. Scheduled jobs can be given a termination condition as well, which
          is either a fixed number of iterations or a certain date.
        </p>
        <h4>When should it start?</h4>
        <p>
          If you want the job to start running now, do not set a run time. However, if you
          wish to set the initial date and time for the job, or you would like to specify
          when a repeating job should be run, then click the <b>Set a run time</b>{' '}
          checkbox to the right of the interval form and set a date and time. Enter the
          desired local time in 24-hour format.
        </p>
        <h4>Does it require additional information?</h4>
        <p>
          If the job requires certain parameters, you can add them to the Parameters
          table, which shows all the parameters that will be passed to the job. If you
          need to edit a parameter, simply enter the key with the new value as if you were
          adding a new parameter.
        </p>
      </div>
    </div>
  )
}

export default FormInfo
