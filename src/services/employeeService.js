
import api from './api'

export function getAttendanceStats(companyId) {
  if (companyId && companyId !== 'all') {
    return api.get('/dashboard/employees-attendance-statistics', {
      params: { companyId }
    })
  } else {
    return api.get('/dashboard/employees-attendance-statistics')
  }
}

export function getEmployeesAttendance({ companyId = null, pageNumber = 1, pageSize = 10000 } = {}) {
  const params = { pageNumber, pageSize }
  if (companyId && companyId !== 'all') params.companyId = companyId
  return api.get('/dashboard/employees-attendance', { params })
}

export function getCompanies(pageNumber = 1, pageSize = 100) {
  return api.get('/companies', { params: { pageNumber, pageSize } })
}

export function getEmployees({ 
  companyId = null, 
  pageNumber = 1, 
  pageSize = 10000, 
  filter = '' 
} = {}) {
  const params = { pageNumber, pageSize }
  if (companyId && companyId !== 'all') params.companyId = companyId
  if (filter) params.filter = filter
  return api.get('/employees', { params })
}

export function addEmployee(formData) {
  return api.post('/employees', formData)
}

export function getEmployeeById(id) {
  return api.get(`/employees/${id}`)
}

export function updateEmployee(id, data) {
  return api.put(`/employees/${id}`, data)
}

export function deleteEmployee(id) {
  return api.delete(`/employees/${id}`)
}


export function formatEmployeeImage(imageData) {
  if (!imageData) return null
  if (imageData.startsWith('data:')) {
    return imageData
  }
  if (imageData.length > 100) {
    return `data:image/jpeg;base64,${imageData}`
  }
  return imageData
}

export function getEmployeeImageUrl(employee) {
  if (!employee || !employee.image) {
    return null
  }
  return formatEmployeeImage(employee.image)
}
