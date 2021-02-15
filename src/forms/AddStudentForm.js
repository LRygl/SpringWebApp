import { Formik } from 'formik';
import { Input, Button, Tag } from 'antd';
import { addNewStudent } from '../client.js';

const inputButtonMargin = {marginBottom: '5px'};
const tagStyle = {backgroundColor: '#f50', color: 'white', ...inputButtonMargin};

const AddStudentForm = (props) => (
    <Formik
//Hodnoty pro nově inicializovaný modal
    initialValues={{ firstName: '', lastName: '', email: '', gender:''}}
    //????
    validate={values => {
        //Do errors ukládáme všechny chyby které nakonec vypíšeme
        const errors = {};

        //Validace křestního jména
        if (!values.firstName) {
            errors.firstName = 'First Name is required'
        }
        
        //Validace příjmení
        if (!values.lastName) {
            errors.lastName = 'Last Name is required'
        }

        //Validace hodnoty emailu jako regex
        if (!values.email) {
            errors.email = 'Required';
        } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
            errors.email = 'Invalid email address';
        }

        //Validace pohlaví
        if (!values.gender) {
            errors.gender = 'Gender is required'
        } else if (!['MALE','male','FEMALE','female'].includes(values.gender)){
            errors.gender = 'Gender must by MALE / FEMALE'
        }
        //Vypiš všechny chyby v errors
        return errors;

        }}
        onSubmit={(newStudent, { setSubmitting }) => {
            addNewStudent(newStudent).then(() => {
                //alert(JSON.stringify(newStudent));
                props.onSuccess();
            })
            .catch(err=>{
                props.onFailure(err);
            })
            .finally(()=>{
                setSubmitting(false);
            })
            
        }}>
    {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        submitForm,
        isValid
        /* and other goodies */
        //Jednotlivé input fieldy a jejich vlastnosti - style je definovaný const na začátku dokument
    }) => (
        <form onSubmit={handleSubmit}>
            
            <Input
                style={inputButtonMargin}
                name="firstName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.firstName}
                placeholder='First Name'
            />
            {errors.firstName && touched.firstName && <Tag style={tagStyle}>{errors.firstName}</Tag>}
            <Input
                style={inputButtonMargin}
                name="lastName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lastName}
                placeholder='Last Name'
            />
            {errors.lastName && touched.lastName && <Tag style={tagStyle}>{errors.lastName}</Tag>}


            <Input
                style={inputButtonMargin}
                name="email"
                type="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                placeholder='Email'
            />
            {errors.email && touched.email && <Tag style={tagStyle}>{errors.email}</Tag>}

            <Input
                style={inputButtonMargin}
                name="gender"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.gender}
                placeholder='Gender'
            />
            {errors.gender && touched.gender && <Tag style={tagStyle}>{errors.gender}</Tag>}

            <Button 
                onClick={()=>submitForm()} 
                type="submit" 
                disabled={isSubmitting | (touched && !isValid)}>
                Submit
            </Button>

        </form>
    )}
    </Formik>
);

export default AddStudentForm;