import React, {
  Component
} from 'react';
import RecordForm from './RecordForm';
import Record from './Record';
import AmountBox from './AmountBox';
import * as RecordsAPI from '../utils/RecordsAPI';

class Records extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      isLoading: false,
      records: []
    };
  }

  componentDidMount() {
    RecordsAPI.getAll().then(
      response => this.setState({
        records: response.data,
        isLoading: true
      }),
      error => this.setState({
        isLoading: true,
        error
      })
    )
  }

  addRecord(record) {
    this.setState({
      error: null,
      isLoading: true,
      records: [
        ...this.state.records,
        record
      ]
    });
  }

  updateRecord(record, data) {
    const recordIndex = this.state.records.indexOf(record);
    const newRecords = this.state.records.map((item, index) => {
      if (index !== recordIndex) {
        return item;
      }

      return {
        ...item,
        ...data
      };
    });
    this.setState({
      records: newRecords
    })
  }

  deleteRecord(record) {
    const recordIndex = this.state.records.indexOf(record);
    const newRecords = this.state.records.filter((item, index) => index !== recordIndex);
    this.setState({
      records: newRecords
    });
  }

  credits() {
    let credits = this.state.records.filter((record) => {
      return record.amount >= 0
    })

    return credits.reduce((prev, curr) => {
      return prev + Number.parseInt(curr.amount, 0)
    }, 0);
  }

  debits() {
    let credits = this.state.records.filter((record) => {
      return record.amount < 0;
    })

    return credits.reduce((prev, curr) => {
      return prev + Number.parseInt(curr.amount, 0)
    }, 0);
  }

  balance() {
    return this.credits() + this.debits();
  }

  render() {
    const {
      error,
      isLoading,
      records
    } = this.state;

    let recordsComponent;

    if (error) {
      recordsComponent = <div>Error: {error.message}</div>;
    } else if (!isLoading) {
      recordsComponent = <div>Loading...</div>;
    } else {
      recordsComponent = (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>日期</th>
              <th>标题</th>
              <th>金额</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, i) => (
              <Record
                key={i}
                record={record}
                handleEditRecord={this.updateRecord.bind(this)}
                handleDeleteRecord={this.deleteRecord.bind(this)}
              />
            ))}
          </tbody>
        </table>
      );
    }

    return (
      <div>
        <h2>Records</h2>
        <div className="row mb-3">
          <AmountBox text="收入" type="success" amount={this.credits()} />
          <AmountBox text="支出" type="danger" amount={this.debits()} />
          <AmountBox text="差额" type="info" amount={this.balance()} />
        </div>
        <RecordForm handleNewRecord={this.addRecord.bind(this)} />
        {recordsComponent}
      </div>
    );
  }
}

export default Records;