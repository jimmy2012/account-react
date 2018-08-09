import React, {
  Component
} from 'react';
import * as RecordsAPI from '../utils/RecordsAPI';

export default class RecordForm extends Component {
  constructor() {
    super();

    this.state = {
      date: "",
      title: "",
      amount: ""
    };
  }

  handleChange(e) {
    let name, obj;
    name = e.target.name;
    this.setState((
      obj = {},
      obj["" + name] = e.target.value,
      obj
    ))
  }

  handleSubmit(e) {
    e.preventDefault();
    RecordsAPI.create({
      date: this.state.date,
      title: this.state.title,
      amount: Number.parseInt(this.state.amount, 0)
    }).then(
      response => {
        this.props.handleNewRecord(response.data);
        this.setState({
          date: "",
          title: "",
          amount: ""
        });
      }
    ).catch(
      error => console.log(error.message)
    )
  }

  valid() {
    return this.state.date && this.state.title && this.state.amount
  }

  render() {
    return (
      <form className="form-inline mb-3" onSubmit={this.handleSubmit.bind(this)}>
        <div className="form-group mr-1">
          <input type="text" onChange={this.handleChange.bind(this)} className="form-control" placeholder="日期" name="date" value={this.state.date} />
        </div>
        <div className="form-group mr-1">
          <input type="text" onChange={this.handleChange.bind(this)} className="form-control" placeholder="标题" name="title" value={this.state.title} />
        </div>
        <div className="form-group mr-1">
          <input type="text" onChange={this.handleChange.bind(this)} className="form-control" placeholder="金额" name="amount" value={this.state.amount} />
        </div>
        <button className="btn btn-primary" disabled={!this.valid()}>新建记录</button>
      </form>
    );
  }
}