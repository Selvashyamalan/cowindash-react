import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationCoverage from '../VaccinationCoverage'

import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstant.initial,
    vaccinationData: {},
  }

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({
      apiStatus: apiStatusConstant.inProgress,
    })

    const response = await fetch('https://apis.ccbp.in/covid-vaccination-data')
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = {
        last7DaysVaccination: fetchedData.last_7_days_vaccination.map(
          eachDayData => ({
            vaccinationDate: eachDayData.vaccination_date,
            dose1: eachDayData.dose_1,
            dose2: eachDayData.dose_2,
          }),
        ),
        vaccinationByAge: fetchedData.vaccination_by_age.map(eachAgeData => ({
          age: eachAgeData.age,
          count: eachAgeData.count,
        })),
        vaccinationByGender: fetchedData.vaccination_by_gender.map(
          eachGenderData => ({
            count: eachGenderData.count,
            gender: eachGenderData.gender,
          }),
        ),
      }
      this.setState({
        apiStatus: apiStatusConstant.success,
        vaccinationData: updatedData,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstant.failure,
      })
    }
  }

  renderFailureView = () => (
    <>
      <div className="failure-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
          alt="failure-view"
          className="failure-img"
        />
        <h1 className="failure-text">Something Went Wrong</h1>
      </div>
    </>
  )

  renderVaccinationData = () => {
    const {vaccinationData} = this.state
    return (
      <>
        <VaccinationCoverage
          VaccinationCoverageDetails={vaccinationData.last7DaysVaccination}
        />
        <VaccinationByGender
          VaccinationGenderDetails={vaccinationData.vaccinationByGender}
        />
        <VaccinationByAge
          VaccinationAgeDetails={vaccinationData.vaccinationByAge}
        />
      </>
    )
  }

  renderProgressView = () => (
    <>
      <div className="loading" data-testid="loader">
        <Loader color="#ffffff" height={80} type="ThreeDots" width={80} />
      </div>
    </>
  )

  renderViewBasedOnApi = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderVaccinationData()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      case apiStatusConstant.inProgress:
        return this.renderProgressView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="cowin-dash-container">
          <div className="logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              className="logo-image"
              alt="website logo"
            />
            <h1 className="logo-heading">Co-WIN</h1>
          </div>
          <h1 className="heading">CoWin Vaccination in India</h1>
          {this.renderViewBasedOnApi()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
