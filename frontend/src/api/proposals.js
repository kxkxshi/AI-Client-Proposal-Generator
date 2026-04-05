import api from './axiosInstance'

/**
 * Generate a new AI proposal and save it to the database.
 * @param {Object} proposalData
 */
export const generateProposal = async (proposalData) => {
  const response = await api.post('/api/proposals/generate', proposalData)
  return response.data
}

/**
 * Get all proposals for the current user.
 */
export const getAllProposals = async () => {
  const response = await api.get('/api/proposals/')
  return response.data
}

/**
 * Get a single proposal by ID.
 * @param {string} id - Proposal UUID
 */
export const getProposalById = async (id) => {
  const response = await api.get(`/api/proposals/${id}`)
  return response.data
}

/**
 * Delete a proposal by ID.
 * @param {string} id - Proposal UUID
 */
export const deleteProposal = async (id) => {
  await api.delete(`/api/proposals/${id}`)
}
