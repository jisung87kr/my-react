import React from 'react';
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import 'jquery-ui/ui/disable-selection';
import 'jquery-ui/ui/widgets/sortable';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      value: '',
      todo: []
    }
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value
    });
  }

  handleEnter = (e) => {
    if(e.keyCode === 13){
      const val = e.target.value;
      if(!val){
        alert('내용을 입력하세요');
        return false;
      }
      this.setState((state) => {
        const data = {value: val, completed: false}
        return {
          value: '',
          todo: [...state.todo, data]
        }
      });
    }
  }

  handleEdit = (e, idx) => {
    const val = e.target.value;
    this.setState(state => {
      const todo = state.todo.map((item, i) => {
        if(i === idx){
          item['value'] = val;
          return item;
        } else {
          return item;
        }
      });
      return {
        ...state,
        todo
      }
    });
  }

  handleComplete = (e, idx) => {
    const val = e.target.checked;
    this.setState((state) => {
      const todo = state.todo.map((item, i) => {
        if(i === idx){
          item['completed'] =val
          return item;
        } else {
          return item;
        }
      });

      return {
        ...state,
        todo
      }
    });
  }

  handleRemove = (e, idx) => {
    this.setState(state => {
      const todo = state.todo.filter((item, i) => {
        return i !== idx;
      });
      return {
        ...state,
        todo
      }
    });
  }

  handleRefresh = (todo) => {
    this.setState(state => {
      return {
        ...state,
        todo
      }
    });
  }

  componentDidMount(){
    $( "#sortable" ).sortable({
      update: (event, ui) => {
        const todo = [];
        let sorted = $("#sortable").sortable("toArray");
        for(let i=0; i<sorted.length; i++){
          let val = $("#"+sorted[i]).find("input[type=text]").val();
          let completed = $("#"+sorted[i]).find("input[type=checkbox]").prop('checked');
          let data = {value: val, completed: completed}; 
          todo.push(data);
        }
        this.handleRefresh(todo);
      }
    });
    $( "#sortable" ).disableSelection();
  }

  componentWillUnmount(){
  }

  componentDidUpdate(prevProps, prevState) {
    
  }
  
  render(){
    return (
      <div className="container mt-5">
        <h1 className="text-center">TODO LIST</h1>
        <Input 
          val={this.state.value}
          onChange={this.handleChange}
          onEnter={this.handleEnter}
        />
        <List todo={this.state.todo}
              onEdit={this.handleEdit}
              onComplete={this.handleComplete}
              onRemove={this.handleRemove}
        />
      </div>
    )
  }
}

class Input extends React.Component{
  render(){
    return (
      <div className="form-group">
        <input type="text"
              className="form-control"
              name="todo"
              id="todo"
              value={this.props.val}
              onChange={(e) => {this.props.onChange(e)}}
              onKeyDown={(e) => {this.props.onEnter(e)}}
        />
      </div>
    )
  }
}

class List extends React.Component{
  render(){
    let list = this.props.todo.map((item, i)=>{
      return (
        <li key={i} className="mb-2 ui-state-default" id={"todo_"+i}>
          <div className="input-group">
            <div className="input-group-prepend">
              <div className="input-group-text">
                <input type="checkbox" 
                      name={'item_'+i}
                      checked={item.completed}
                      onChange={(e) => {this.props.onComplete(e, i)}}
                />
              </div>
            </div>
            <input type="text"
                  value={item.value}
                  onChange={ (e) => {this.props.onEdit(e, i)}}
                  className="form-control"
            />
            <div className="input-group-append">
              <input type="button" 
                    name={'remove_'+i}
                    onClick={(e) => {this.props.onRemove(e, i)}}
                    value="삭제"
                    className="btn btn-danger btn-sm"
              />
            </div>
          </div>
        </li>
      )
    });

    return (
      <ol id="sortable">
        {list}
      </ol>
    )
  }
}

export default App;
