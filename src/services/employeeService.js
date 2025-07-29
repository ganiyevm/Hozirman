
// import api from './api'

// export function getAttendanceStats(companyId) {
//   if (companyId && companyId !== 'all') {
//     return api.get('/dashboard/employees-attendance-statistics', {
//       params: { companyId }
//     })
//   } else {
//     return api.get('/dashboard/employees-attendance-statistics')
//   }
// }

// export function getEmployeesAttendance({ companyId = null, pageNumber = 1, pageSize = 10000 } = {}) {
//   const params = { pageNumber, pageSize }
//   if (companyId && companyId !== 'all') params.companyId = companyId
//   return api.get('/dashboard/employees-attendance', { params })
// }

// export function getCompanies(pageNumber = 1, pageSize = 100) {
//   return api.get('/companies', { params: { pageNumber, pageSize } })
// }

// export function getEmployees({ 
//   companyId = null, 
//   pageNumber = 1, 
//   pageSize = 10000, 
//   filter = '' 
// } = {}) {
//   const params = { pageNumber, pageSize }
//   if (companyId && companyId !== 'all') params.companyId = companyId
//   if (filter) params.filter = filter
//   return api.get('/employees', { params })
// }

// export function addEmployee(formData) {
//   return api.post('/employees', formData)
// }

// export function getEmployeeById(id) {
//   return api.get(`/employees/${id}`)
// }

// export function updateEmployee(id, data) {
//   return api.put(`/employees/${id}`, data)
// }

// export function deleteEmployee(id) {
//   return api.delete(`/employees/${id}`)
// }


// export function formatEmployeeImage(imageData) {
//   if (!imageData) return null
//   if (imageData.startsWith('data:')) {
//     return imageData
//   }
//   if (imageData.length > 100) {
//     return `data:image/jpeg;base64,${imageData}`
//   }
//   return imageData
// }

// export function getEmployeeImageUrl(employee) {
//   if (!employee || !employee.image) {
//     return null
//   }
//   return formatEmployeeImage(employee.image)
// }


// api-functions.js - Fixed version with error handling
import api from './api'

export async function getAttendanceStats(companyId) {
  try {
    const params = {}
    if (companyId && companyId !== 'all') {
      params.companyId = companyId
    }
    
    const response = await api.get('/dashboard/employees-attendance-statistics', { params })
    return {
      success: true,
      data: response.data || {}
    }
  } catch (error) {
    console.error('Error fetching attendance stats:', error)
    return {
      success: false,
      data: {
        inOffice: 0,
        absent: 0,
        late: 0,
        onTime: 0
      },
      error: error.message
    }
  }
}

export async function getEmployeesAttendance({ companyId = null, pageNumber = 1, pageSize = 10000 } = {}) {
  try {
    const params = { pageNumber, pageSize }
    if (companyId && companyId !== 'all') params.companyId = companyId
    
    const response = await api.get('/dashboard/employees-attendance', { params })
    return {
      success: true,
      data: {
        items: response.data?.items || [],
        totalCount: response.data?.totalCount || 0
      }
    }
  } catch (error) {
    console.error('Error fetching employees attendance:', error)
    return {
      success: false,
      data: {
        items: [],
        totalCount: 0
      },
      error: error.message
    }
  }
}

export async function getCompanies(pageNumber = 1, pageSize = 100) {
  try {
    const response = await api.get('/companies', { 
      params: { pageNumber, pageSize } 
    })
    return {
      success: true,
      data: {
        items: response.data?.items || [],
        totalCount: response.data?.totalCount || 0
      }
    }
  } catch (error) {
    console.error('Error fetching companies:', error)
    return {
      success: false,
      data: {
        items: [],
        totalCount: 0
      },
      error: error.message
    }
  }
}

export async function getEmployees({ 
  companyId = null, 
  pageNumber = 1, 
  pageSize = 10000, 
  filter = '' 
} = {}) {
  try {
    const params = { pageNumber, pageSize }
    if (companyId && companyId !== 'all') params.companyId = companyId
    if (filter) params.filter = filter
    
    const response = await api.get('/employees', { params })
    return {
      success: true,
      data: {
        items: response.data?.items || [],
        totalCount: response.data?.totalCount || 0
      }
    }
  } catch (error) {
    console.error('Error fetching employees:', error)
    return {
      success: false,
      data: {
        items: [],
        totalCount: 0
      },
      error: error.message
    }
  }
}

export async function addEmployee(formData) {
  try {
    const response = await api.post('/employees', formData)
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error adding employee:', error)
    return {
      success: false,
      error: error.response?.data?.message || error.message
    }
  }
}

export async function getEmployeeById(id) {
  try {
    const response = await api.get(`/employees/${id}`)
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error fetching employee:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export async function updateEmployee(id, data) {
  try {
    const response = await api.put(`/employees/${id}`, data)
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error updating employee:', error)
    return {
      success: false,
      error: error.response?.data?.message || error.message
    }
  }
}

export async function deleteEmployee(id) {
  try {
    const response = await api.delete(`/employees/${id}`)
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Error deleting employee:', error)
    return {
      success: false,
      error: error.response?.data?.message || error.message
    }
  }
}

// Utility functions remain the same
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