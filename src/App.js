import React, { Component } from 'react';
import Container from './Container';
import './App.css';
import {getAllStudents } from './client';
import {Table, Avatar} from "antd";
import {LoadingOutlined,} from '@ant-design/icons';

const getIndicatorIcon = () => <LoadingOutlined style={{ fontSize: '48px'}} spin/>;

class App extends Component{

  //Nastav students na empty 
  //Nastav spinner na false
state = {
  students: [],
  isFetching: false
}

componentDidMount(){
  this.fetchStudents();
}
//Metoda pro získání všech studentů z JSON
fetchStudents = ()=> {
  //Nastav state pro spinner -> načítám data
  this.setState({
    isFetching: true
  });
  //Vypiš všechny studenty do students a do logu
  getAllStudents()
    .then(res => res.json()
    .then(students => {
      console.log(students);
      //vrací hodnotu do students a nastaví fetching na false -> dokončeno fetchovani
      this.setState({
        students,
        isFetching: false
      });
  }));
}

  render() {
    
    const {students,isFetching} = this.state;
    
    if (isFetching){
      return(
        <Container>
          <LoadingOutlined indicator={getIndicatorIcon()}/>
        </Container>
      )
    }

    //pokud students !empty vytisnkni studenty, jinak ->
    if (students && students.length) {
      //Sloupce tabulky + AVATAR vytvoření z prvních písmen frsn a lasn
      const columns = [
        {
        title: '',
        key: 'Avatar',
        render:(text,student)=>(
            <Avatar size='large'>
              {`${student.firstName.charAt(0).toUpperCase()}${student.lastName.charAt(0).toUpperCase()}`}
            </Avatar>
          )
        },
      
        {
          title: 'Student Id',
          dataIndex: 'studentId',
          key: 'studentId'
        },
        {
          title: 'firstName',
          dataIndex: 'firstName',
          key: 'firstName'
        },
        {
          title: 'lastName',
          dataIndex: 'lastName',
          key: 'lastName'
        },
        {
          title: 'email',
          dataIndex: 'email',
          key: 'email'
        },
        {
          title: 'gender',
          dataIndex: 'gender',
          key: 'gender'
        },
      ];
//samotný print obsahu zdroj, sloupce, pagintation a podle čeho bereme studenty
//Container dělá odsazení tabulky od okrajů a je v Container.JS
      return (
        <Container>  
          <Table 
            dataSource={students} 
            columns={columns} 
            pagination={false}
            rowKey='studentId' 
          />
        </Container>
      
      );

    }
    // POkud neexistuje žádný student, zobraz hlášku
    return <h1>No Students Found</h1>
  }
}

export default App;
