

const Schemes = require('./scheme-model.js')




/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = async (req, res, next) => {
  const id = req.params.scheme_id  
  try{
    const scheme=await Schemes.findById(id)
    if(scheme===null){      
      return res.status(404).json({ message:`scheme with scheme_id ${id} not found`})
    }else{
      next()
    }
  }catch(err){
    return res.status(404).json({
      message:`scheme with scheme_id ${id} not found`
    })
  }
}

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  console.log(req.body  )
}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {

}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
