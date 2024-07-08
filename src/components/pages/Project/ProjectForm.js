import styles from './ProjectForm.module.css'
import Input from '../../form/Input'
import Select from '../../form/Select'
import SubmitButton from '../../form/submit'
import { useEffect, useState } from 'react'

function ProjectForm({handleSumit, btnText, projectData}){
    const [categories, setcategories] = useState([])
    const [project, setProject] = useState(projectData || {})
    
    useEffect(() => {
        fetch('http://localhost:5000/categories', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((resp) => resp.json())
        .then((data) => {
            setcategories(data)
        })
        .catch((err) => console.log(err))
    }, [])

    const submit = (e) =>{
        e.preventDefault()
        handleSumit(project)
    }

    function handleChance(e) {
        setProject({...project, [e.target.name]: e.target.value })
    }

    function handleSelect(e) {
        setProject({...project, category: {
            id: e.target.value,
            name: e.target.options[e.target.selectedIndex].text
        } })
    }

    return (
        <form  onSubmit={submit} className={styles.form}>
            <Input
                type="text"
                text="Nome do projeto"
                name="nomeProjeto"
                placeholder="Insira o nome do projeto"
                handleOnChance={handleChance}
                value={project.nomeProjeto}
            />
            <Input
                type="number"
                text="Orçamento do projeto"
                name="butget"
                placeholder="Insira o orçamento do projeto"
                handleOnChance={handleChance}
                value={project.butget}

            />
            <Select 
                name="category_id"
                text="Selecione a categoria"
                options={categories}
                handleOnChance={handleSelect}
                value={project.category ? project.category.id : ""}
            />
            <SubmitButton
                text={btnText}
            />
        </form>
    )
}

export default ProjectForm