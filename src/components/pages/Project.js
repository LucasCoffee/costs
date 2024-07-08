
import { v4 as uuidv4} from 'uuid'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import styles from './Project.module.css'

import Loading from '../layout/Loading'
import Container from '../layout/Container'
import ProjectForm from '../project/ProjectForm'
import Message from '../layout/Message'
import ServiceForm from '../Service/Service'
import ServiceCard from '../Service/ServiceCard'




function Project() {
  let { id } = useParams()
  const [project, setProject] = useState({})
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showServiceForm, setServiceForm] = useState(false)
  const [message, setMessage] = useState('')
  const [type, setType] = useState('success')
  const [services, setServices] = useState([])
  useEffect(() => {
    // Para ver o loading
    fetch(`http://localhost:5000/projects/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data)
        setServices(data.services)
      })
      .catch((err) =>{
        console.log(err)
      })
      
  }, [id])

  function editPost(project) {
    // budget validation
    if (project.budget < project.cost) {
      setMessage('O Orçamento não pode ser menor que o custo do projeto!')
      setType('error')
      return false
    }

    fetch(`http://localhost:5000/projects/3f10`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data)
        setShowProjectForm(false)
        setMessage('Projeto atualizado!')
        setType('success')
      })
      .catch((err) => console.log(err))
  }

      function createService(project){
        
        const lastService = project.services[project.services.length - 1]
        lastService.id = uuidv4()

        const newCost = parseFloat(project.cost) + parseFloat(lastService.cost)

        if(newCost > parseFloat(project.budget)){
          setMessage("Orçamento ultrapassado")
          setType('error')
          project.services.pop()
          return false
        }

        project.cost = newCost

        fetch(`http://localhost:5000/projects/${project.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(project)
        })
          .then((resp) => resp.json())
          .then((data) => {
            console.log(data)
            setMessage('Serviço adicionado!')
            setType('success')
            setServiceForm(false)
          })
          .catch((err) => console.log(err))
      }

  function toggleProjectForm() {
    setShowProjectForm(!showProjectForm)
  }

  function toggleServiceForm() {
    setServiceForm(!showServiceForm)
  }

  function removeService(id, cost){
    const serviceUpdated = project.services.filter(
      (service) => service.id !== id
    )
    const ProjectUpdated = project
    ProjectUpdated.services = serviceUpdated
    ProjectUpdated.cost = parseFloat(ProjectUpdated.cost) - parseFloat(cost)
    console.log(ProjectUpdated.id)

    fetch('http://localhost:5000/projects/' + ProjectUpdated.id, {
      method: "PATCH",
      headers:{
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(ProjectUpdated)
    })
    .then((data) => {
      setProject(ProjectUpdated)
      setServices(serviceUpdated)
      setMessage("Projeto removido com sucesso")
      setType("sucess")
    })
    .catch((erro) => console.log(erro))

  }

  return (
    <>
      {project.name ? (
        <div className={styles.project_details}>
          <Container customClass="column">
            {message && <Message type={type} msg={message} />}
            <div className={styles.details_container}>
              <h1>Projeto: {project.name}</h1>
              <button className={styles.btn} onClick={toggleProjectForm}>
                {!showProjectForm ? 'Editar projeto' : 'Fechar'}
              </button>
              {!showProjectForm ? (
                <div className={styles.form}>
                  <p>
                    <span>Categoria:</span> {project.category.name}
                  </p>
                  <p>
                    <span>Total do orçamento:</span> R${project.budget}
                  </p>
                  <p>
                    <span>Total utilizado:</span> R${project.cost}
                  </p>
                </div>
              ) : (
                <div className={styles.project_info}>
                  <ProjectForm
                    handleSubmit={editPost}
                    btnText="Concluir Edição"
                    projectData={project}
                  />
                </div>
              )}
            </div>
            <div className={styles.service_form_container}>
              <h2>Adicione um serviço:</h2>
              <div className={styles.form}>
              <button className={styles.btn} onClick={toggleServiceForm}>
                {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
              </button>
              <div className={styles.form}>
                  {showServiceForm && (
                    <div>
                      <ServiceForm 
                        handleSubmit={createService}
                        btnText="Adicionar Serviço"
                        projectData={project}
                      />
                    </div>
                  )}
              </div>
              </div>
            </div>
            <h2>Serviços:</h2>
            <Container customClass="start">
                  {services.length > 0 && 
                    services.map((service) => (
                      <ServiceCard
                        id={service.id}
                        name={service.name}
                        cost={service.cost}
                        description={service.description}
                        key={service.id}
                        handleRemove={removeService}

                      />
                    ))
                  }
                  {services.length === 0 && <p>Não há serviços adicionados</p>}
            </Container>
          </Container>
        </div>
      ) : (
        <Loading />
      )}
    </>
  )
}


export default Project
