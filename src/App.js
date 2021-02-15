import React, { Component } from 'react';
import Container from './Container';
import Footer from './Footer';
import './App.css';
import {getAllStudents } from './client';
import AddStudentForm from './forms/AddStudentForm';
import {errorNotification, successNotification} from './Notification';
import {Table, Avatar, Modal, Empty, Icon} from "antd";
import {LoadingOutlined} from '@ant-design/icons';


const getIndicatorIcon = () => <LoadingOutlined style={{ fontSize: '48px'}} spin/>;

class App extends Component{

  //Nastav students na empty 
  //Nastav spinner na false
state = {
  students: [],
  isFetching: false,
  isAddStudentModalVisible: false
}

componentDidMount(){
  this.fetchStudents();
}


openAddStudentModal = () => this.setState({isAddStudentModalVisible:true})
closeAddStudentModal = () => this.setState({isAddStudentModalVisible:false})

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
  }))
  .catch(error => {
    console.log(error.error);
    const message = error.error.message;
    const description = error.error.error;
    errorNotification(message, description);
    this.setState({
      isFetching: false
    });
  });
}

render() {

    const {students, isFetching, isAddStudentModalVisible} = this.state;

    // Common elements modal a footer pro stránku Ok a No studentFound
    const commonElements = () => (
      <div>
        <Modal
          title='+ Add New Student}'
          visible={isAddStudentModalVisible}
          onOk={this.closeAddStudentModal}
          onCancel={this.closeAddStudentModal}
          width={250}>
          
            <AddStudentForm 
              onSuccess={()=>{
                this.closeAddStudentModal();
                this.fetchStudents();
              }}
              onFailure={(error)=> {
                const message = error.error.message;
                const description = error.error.httpStatus;
                console.log(JSON.stringify(error));
                errorNotification(message,description);
              }}
            />
        </Modal>
        <Footer 
          numberOfStudents={students.length}
          handleAddStudentClickEvent={this.openAddStudentModal}>
        </Footer>
      </div>
    )

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
            style={{marginBottom:'70px'}}
            dataSource={students} 
            columns={columns} 
            pagination={false}
            rowKey='studentId' 
          />
        {commonElements()}
        </Container>

      );

    }
    // POkud neexistuje žádný student, zobraz hlášku
    return (
      <Container>
        <Empty description={
          <h1>No Students were found</h1>
        } />
        {commonElements()}
      </Container>
    )
  }
}

export default App;
