/** @jsx React.DOM */
var EmailSchedule = React.createClass({

	propTypes: {
		text: React.PropTypes.object,
		timetable: React.PropTypes.array
	},

	diff: function(start, end) {
	    start = start.split(":");
	    end = end.split(":");
	    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
	    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
	    var diff = endDate.getTime() - startDate.getTime();
	    return diff / (1000*60*60);

	    var hours = Math.floor(diff / 1000 / 60 / 60);
	    diff -= hours * 1000 * 60 * 60;
	    var minutes = Math.floor(diff / 1000 / 60);
	    
	    return (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes;
	},

	render: function() {
		var WeeklySchedule = this.props.timetable.map(function(d, index) {
			var output;
			var allday;
			if (d.amhourout == 12) {
				var pmhourin = (d.pmhourin*1) + 12;
				var start = d.amhourout + ":" + d.amminout;
				var end = pmhourin + ":" + d.pmminin;
				var diff = this.diff(start,end);
				output = 
					<div>
						<h4>{d.day} </h4>
						<p>{d.amhourin}:{d.amminin} {d.amhourin < 12 ? 'am' : 'pm'} até <span className="red"><strong>{d.pmhourout}:{d.pmminout} pm</strong></span> </p>
						<p><span className='gray italic'>{diff} hour break for lunch</span></p>
					</div>
			      ;
			} else {
				allday = '';
				output = 
					<div>
						<h4>{d.day} </h4>
						<p>{d.amhourin}:{d.amminin} {d.amhourin < 12 ? 'am' : 'pm'} até {d.amhourout}:{d.amminout} {d.amhourout < 12 ? 'am' : 'pm'} </p>
						<p>{d.pmhourin}:{d.pmminin} pm até <span className="red"><strong>{d.pmhourout}:{d.pmminout} pm</strong></span></p>
					</div>
			      ;
			}
			return (
				<div key={index}>
				{output}
				</div>
				);
		}.bind(this));
		return (
			<div className="print">
				<h3>Horario da semana</h3>
				<div ref="timedata">
				{WeeklySchedule}
				</div>
			</div>
		);
	}
});

var Schedule = React.createClass({

	diff: function(start, end) {
	    start = start.split(":");
	    end = end.split(":");
	    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
	    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
	    var diff = endDate.getTime() - startDate.getTime();
	    return diff / (1000*60*60);

	    var hours = Math.floor(diff / 1000 / 60 / 60);
	    diff -= hours * 1000 * 60 * 60;
	    var minutes = Math.floor(diff / 1000 / 60);
	    
	    return (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes;
	},

	getInitialState: function() {

		var totalhours = 0;
		var timetable = [
				{
					day: 'Segunda',
					amhourin: '7',
					amminin: '00',
					amhourout: '9',
					amminout: '15',
					diffam: '1.5',
					pmhourin: '2',
					pmminin: '45',
					pmhourout: '7',
					pmminout: '00',
					diffpm: '',
					diffday: ''
				},
				{
					day: 'Terça',
					amhourin: '7',
					amminin: '00',
					amhourout: '12',
					amminout: '00',
					diffam: '',
					pmhourin: '1',
					pmminin: '00',
					pmhourout: '6',
					pmminout: '30',
					diffpm: '',
					diffday: ''
				},				{
					day: 'Quarta',
					amhourin: '7',
					amminin: '00',
					amhourout: '12',
					amminout: '00',
					diffam: '',
					pmhourin: '1',
					pmminin: '30',
					pmhourout: '7',
					pmminout: '00',
					diffpm: '',
					diffday: ''
				},				{
					day: 'Quinta',
					amhourin: '7',
					amminin: '00',
					amhourout: '12',
					amminout: '00',
					diffam: '',
					pmhourin: '1',
					pmminin: '00',
					pmhourout: '6',
					pmminout: '30',
					diffpm: '',
					diffday: ''
				},				{
					day: 'Sexta',
					amhourin: '7',
					amminin: '00',
					amhourout: '9',
					amminout: '15',
					diffam: '',
					pmhourin: '2',
					pmminin: '45',
					pmhourout: '6',
					pmminout: '30',
					diffpm: '',
					diffday: ''
				},			
			];

	    return {
	    	text: {
				in: "entra",
				out: "até",
				am: 'Manhã',
				pm: 'Tarde'
			},
			totalhours: totalhours,
			timetable: timetable
	    };
	},

	componentDidMount: function() {
		this.calculateHours(this);
	},

	calculateHours: function(constructor) {
		var totalhours = 0;
		var dayhours = 0;
		var timetable = this.state.timetable;
		timetable.forEach(function(t, index) {
			dayhours = 0;
			var start = t.amhourin + ":" + t.amminin;
			var end = t.amhourout + ":" + t.amminout;
			var dif = constructor.diff(start, end);
			timetable[index].diffam = dif;
			totalhours += dif;	
			dayhours += dif;
			if (t.pmhourin >= 12) 
				t.pmhourin -= 12;
			start = t.pmhourin + ":" + t.pmminin;
			end = t.pmhourout + ":" + t.pmminout;
			dif = constructor.diff(start, end);
			timetable[index].diffpm = dif;
			totalhours += dif;			
			dayhours += dif;		
			timetable[index].diffpm = dif;
			timetable[index].diffday = dayhours;
		});

		this.setState({timetable: timetable});
		this.setState({totalhours: totalhours});
		console.log('Calculating ' + totalhours);

	},

	saveData: function(field, index) {
		var timetable = this.state.timetable;
		var id = field + index;
		switch (field) {
			case 'amhourin':
				if (this.refs[id].value > 12)
					return;
				timetable[index].amhourin = this.refs[id].value;
				break;
			case 'amminin':
				timetable[index].amminin = this.refs[id].value;
				break;
			case 'amhourout':
				if (this.refs[id].value > 12)
					return;
				timetable[index].amhourout = this.refs[id].value;
				break;
			case 'amminout':
				timetable[index].amminout = this.refs[id].value;
				break;
			case 'pmhourin':
				if (this.refs[id].value > 12)
					return;
				else if (this.refs[id].value == 12)
					this.refs[id].value = 0;
				timetable[index].pmhourin = this.refs[id].value;
				break;
			case 'pmminin':
				timetable[index].pmminin = this.refs[id].value;
				break;
			case 'pmhourout':
				if (this.refs[id].value > 12)
					return;
				else if (this.refs[id].value == 12)
					this.refs[id].value = 0;
				timetable[index].pmhourout = this.refs[id].value;
				break;
			case 'pmminout':
				timetable[index].pmminout = this.refs[id].value;
				break;
		}
		this.setState({timetable: timetable});
		this.calculateHours(this);
	},

	render: function() {

    	var ScheduleList = this.state.timetable.map(function(d, index) {
    		var amhourinLeave = this.saveData.bind(this, "amhourin", index);
    		var ammininLeave = this.saveData.bind(this, "amminin", index);
    		var amhouroutLeave = this.saveData.bind(this, "amhourout", index);
    		var amminoutLeave = this.saveData.bind(this, "amminout", index);
    		var pmhourinLeave = this.saveData.bind(this, "pmhourin", index);
    		var pmmininLeave = this.saveData.bind(this, "pmminin", index);
    		var pmhouroutLeave = this.saveData.bind(this, "pmhourout", index);
    		var pmminoutLeave = this.saveData.bind(this, "pmminout", index);
			return (
		      <div key={index}>
		      	<h3>{d.day} <span className="gray">({d.diffday} hours)</span></h3>
		      	<p><strong>{this.state.text.am}</strong></p>
  	            <form className="form-inline">
		        <div className="form-group">
		          <label htmlFor="amhourin"><span className="red">{this.state.text.in}</span></label>
		          <input className="form-control hour" ref={"amhourin" + index} type="text" id="amhourin" onChange={amhourinLeave} value={d.amhourin} />
		        </div>
		        <div className="form-group">
		          <label htmlFor="amminin">:</label>
		          <input className="form-control minute" ref={"amminin" + index} type="text" id="amminin" onChange={ammininLeave} defaultValue={d.amminin} />
		        </div>
		        <div className="form-group">
		          <label htmlFor="amhourout"><span className="red">{this.state.text.out}</span></label>
		          <input className="form-control hour" ref={"amhourout" + index} type="text" id="amhourout" onChange={amhouroutLeave} defaultValue={d.amhourout} />
		        </div>
		        <div className="form-group">
		          <label htmlFor="amminout">:</label>
		          <input className="form-control minute" ref={"amminout" + index} type="text" id="amminout" onChange={amminoutLeave} defaultValue={d.amminout} />
		        </div>
		        <strong>{d.diffam} hours</strong>
		        </form>
		        <p><strong>{this.state.text.pm}</strong></p>
  	            <form className="form-inline">
		        <div className="form-group">
		          <label htmlFor="pmhourin"><span className="red">{this.state.text.in}</span></label>
		          <input className="form-control hour" ref={"pmhourin" + index} type="text" id="pmhourin" onChange={pmhourinLeave} defaultValue={d.pmhourin} />
		        </div>
		        <div className="form-group">
		          <label htmlFor="pmminin">:</label>
		          <input className="form-control minute" ref={"pmminin" + index} type="text" id="pmminin" onChange={pmmininLeave} defaultValue={d.pmminin} />
		        </div>
		        <div className="form-group">
		          <label htmlFor="pmhourout"><span className="red">{this.state.text.out}</span></label>
		          <input className="form-control hour" ref={"pmhourout" + index} type="text" id="pmhourout" onChange={pmhouroutLeave} defaultValue={d.pmhourout} />
		        </div>
		        <div className="form-group">
		          <label htmlFor="pmminout">:</label>
		          <input className="form-control minute" ref={"pmminout" + index} type="text" id="pmminout" onChange={pmminoutLeave} defaultValue={d.pmminout} />
		        </div>
		        <strong>{d.diffpm} hours</strong>
		        </form>
		      </div>
    		);
	    }.bind(this));
	    return (<div>
	    	{ScheduleList}
	        <h1 className="totalhours">Total hours {this.state.totalhours}</h1>
	        <EmailSchedule timetable={this.state.timetable} text={this.state.text}/>
	    	</div>);
	}
});

ReactDOM.render(<Schedule />, document.getElementById('schedule'));
