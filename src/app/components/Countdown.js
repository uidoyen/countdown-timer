import React, { Component } from 'react';
import { IoMdArrowDropup, IoMdArrowDropdown } from 'react-icons/io';
import LapTimeList from './LapTimeList';

class Countdown extends Component {
  state = {
    timerOn: false,
    timerStart: 0,
    timerTime: 0,
    lapse: [],
    status: ''
  };

  // Set count down time
  adjustTimer = input => {
    const { timerTime, timerOn } = this.state;
    const max = 216000000; //216000000 Milliseconds = 60 hours
    if (!timerOn) {
      if (input === 'incHours' && timerTime + 3600000 < max) {
        this.setState({
          timerTime: timerTime + 3600000
        });
      } else if (input === 'decHours' && timerTime - 3600000 >= 0) {
        this.setState({
          timerTime: timerTime - 3600000
        });
      } else if (input === 'incMinutes' && timerTime + 60000 < max) {
        this.setState({ timerTime: timerTime + 60000 });
      } else if (input === 'decMinutes' && timerTime - 60000 >= 0) {
        this.setState({ timerTime: timerTime - 60000 });
      } else if (input === 'incSeconds' && timerTime + 1000 < max) {
        this.setState({ timerTime: timerTime + 1000 });
      } else if (input === 'decSeconds' && timerTime - 1000 >= 0) {
        this.setState({ timerTime: timerTime - 1000 });
      } else if (input === 'incMSeconds' && timerTime + 10 < max) {
        this.setState({ timerTime: timerTime + 10 });
      } else if (input === 'decMSeconds' && timerTime - 10 >= 0) {
        this.setState({ timerTime: timerTime - 10 });
      }
    }

    //clear counter status message
    this.setState({
      status: ''
    });
  };

  // Start count down
  startTimer = () => {
    this.setState({
      timerOn: true,
      timerTime: this.state.timerTime,
      timerStart: this.state.timerTime
    });

    this.timer = setInterval(() => {
      const newTime = this.state.timerTime - 10;
      if (newTime >= 0) {
        this.setState({
          timerTime: newTime
        });
      } else {
        clearInterval(this.timer);
        this.setState({
          timerOn: false,
          timerStart: 0,
          timerTime: 0,
          lapse: [],
          status:
            'Countdown ended! Please set the countdown duration and click start'
        });
      }
    }, 10);
  };

  // Pause timer
  pauseTimer = () => {
    clearInterval(this.timer);
    this.setState({ timerOn: false });
  };

  // Stop timer
  stopTimer = () => {
    this.setState({
      timerOn: false,
      timerTime: 0,
      timerStart: 0
    });
    clearInterval(this.timer);
  };

  // Handle Lapse
  maintainLaps = event => {
    const { timerOn } = this.state;
    // Event triggered by pressing space key
    if (event.keyCode === 32 && timerOn === true) {
      const { timerTime, lapse } = this.state;

      let centiseconds = ('0' + Math.floor((timerTime / 10) % 100)).slice(-2);
      let seconds = ('0' + (Math.floor((timerTime / 1000) % 60) % 60)).slice(
        -2
      );
      let minutes = ('0' + Math.floor((timerTime / 60000) % 60)).slice(-2);
      let hours = ('0' + Math.floor((timerTime / 3600000) % 60)).slice(-2);

      this.setState({
        status: '',
        lapse: [
          ...this.state.lapse,
          {
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            centiseconds: centiseconds
          }
        ]
      });
    }
    // Check if "space" key was pressed wrongly
    if (event.keyCode !== 32 && timerOn === true) {
      this.setState({
        status: 'Wrong key! Press the "SPACE" key, to maintain laps'
      });
    }
  };

  componentDidMount = () => {
    let previousState = JSON.parse(localStorage.getItem('timerStart'));
    if (previousState.timerStart > 0) {
      this.reStartTimer();
    }

    document.addEventListener('keydown', this.maintainLaps, false);
    window.addEventListener('beforeunload', this.handleTabClose);
    //clear counter status message
    this.setState({
      status: ''
    });
  };

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.maintainLaps, false);
    window.removeEventListener('beforeunload', this.handleTabClose);
  };

  // Restart timer
  reStartTimer = () => {
    let previousState = JSON.parse(localStorage.getItem('timerStart'));
    this.setState({
      timerOn: true,
      timerStart: previousState.timerStart,
      timerTime: previousState.timerTime
    });

    this.timer = setInterval(() => {
      const newTime = this.state.timerTime - 10;
      if (newTime >= 0) {
        this.setState({
          timerTime: newTime
        });
      } else {
        clearInterval(this.timer);
        this.setState({ timerOn: false });
      }
    }, 10);
  };

  //set current timer status to localstorage on tab close or refresh
  handleTabClose = () => {
    localStorage.setItem('timerStart', JSON.stringify(this.state));
  };

  render() {
    const { timerTime, timerStart, timerOn, lapse, status } = this.state;

    let centiseconds = ('0' + Math.floor((timerTime / 10) % 100)).slice(-2);
    let seconds = ('0' + (Math.floor((timerTime / 1000) % 60) % 60)).slice(-2);
    let minutes = ('0' + Math.floor((timerTime / 60000) % 60)).slice(-2);
    let hours = ('0' + Math.floor((timerTime / 3600000) % 60)).slice(-2);

    return (
      <div className="countdown">
        <div className="countdown__header">Countdown Timer</div>
        {timerOn === false ||
          (timerOn === true && (
            <h1 className="countdown__status blinking">{status}</h1>
          ))}

        <div className="countdown__display">
          <div className="countdown__item">
            <div className="countdown__label">HH</div>
            <div>
              <button
                className="btn btn__default"
                onClick={() => this.adjustTimer('incHours')}
                title="Click to increase"
              >
                <IoMdArrowDropup size={32} />
              </button>
            </div>
            <div className="countdown__time">{hours}</div>
            <div>
              <button
                className="btn btn__default"
                onClick={() => this.adjustTimer('decHours')}
                title="Click to decrease"
              >
                <IoMdArrowDropdown size={32} />
              </button>
            </div>
          </div>
          <div className="countdown__item">
            <div className="countdown__label">MM</div>
            <div>
              <button
                className="btn btn__default"
                onClick={() => this.adjustTimer('incMinutes')}
                title="Click to increase"
              >
                <IoMdArrowDropup size={32} />
              </button>
            </div>
            <div className="countdown__time">{minutes}</div>
            <div>
              <button
                className="btn btn__default"
                onClick={() => this.adjustTimer('decMinutes')}
                title="Click to decrease"
              >
                <IoMdArrowDropdown size={32} />
              </button>
            </div>
          </div>
          <div className="countdown__item">
            <div className="countdown__label">SS</div>
            <div>
              <button
                className="btn btn__default"
                onClick={() => this.adjustTimer('incSeconds')}
                title="Click to increase"
              >
                <IoMdArrowDropup size={32} />
              </button>
            </div>
            <div className="countdown__time">{seconds}</div>
            <div>
              <button
                className="btn btn__default"
                onClick={() => this.adjustTimer('decSeconds')}
                title="Click to decrease"
              >
                <IoMdArrowDropdown size={32} />
              </button>
            </div>
          </div>
          <div className="countdown__item">
            <div className="countdown__label">MS</div>
            <div>
              <button
                className="btn btn__default"
                onClick={() => this.adjustTimer('incMSeconds')}
                title="Click to increase"
              >
                <IoMdArrowDropup size={32} />
              </button>
            </div>
            <div className="countdown__time countdown__time--noborder">
              {centiseconds}
            </div>
            <div>
              <button
                className="btn btn__default"
                onClick={() => this.adjustTimer('decMSeconds')}
                title="Click to decrease"
              >
                <IoMdArrowDropdown size={32} />
              </button>
            </div>
          </div>
        </div>

        <div className="ButtonAction">
          {timerOn === false && (timerStart === 0 || timerTime === timerStart) && (
            <button
              className="btn btn__primary"
              onClick={this.startTimer}
              disabled={timerTime === 0}
            >
              Start
            </button>
          )}

          {timerOn === true && timerTime >= 1000 && (
            <button className="btn btn__primary" onClick={this.pauseTimer}>
              Pause
            </button>
          )}

          {timerOn === false &&
            timerStart !== 0 &&
            timerStart !== timerTime &&
            timerTime !== 0 && (
              <button className="btn btn__primary" onClick={this.startTimer}>
                Resume
              </button>
            )}

          {timerOn === true && (
            <button className="btn btn__primary" onClick={this.stopTimer}>
              Stop
            </button>
          )}
        </div>
        <p className="countdown__desc">
          Set the countdown duration and click start. <br />
          Press the
          <strong>"SPACE"</strong> key, to maintain laps.
        </p>

        <div>{lapse.length > 0 && <LapTimeList lapseTime={lapse} />}</div>
      </div>
    );
  }
}

export default Countdown;
