const express = require('express');
const router = express.Router();
const TemplateList = require('../models/TemplateList');
const Employee = require('../models/Employee');
const templateAdmin = require('../models/templateAdmin');

//Get all templates
router.get('/',async (req,res) => {
    try {
        const templist = await TemplateList.find();
        res.json(templist)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.get('/:id', async (req, res) => {
    try {
        const temp = await TemplateList.findById(req.params.id);
        if (!TemplateList) {
            res.status(404).json({message:"Template Not Found"})
        }
        res.json(temp);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Create an Template Data

router.post('/',async (req, res) => {
    
    const template = new TemplateList({

        Temp_id:req.body.Temp_id,
        Temp_name:req.body.Temp_name,
        Temp_category:req.body.Temp_category,
        Temp_status:req.body.Temp_status,
        CreatedBy:req.body.CreatedBy,
        TestedBy:req.body.TestedBy,
        Approval_status:req.body.Approval_status,
        CompletedDate:req.body.CompletedDate,
        ApprovedDate:req.body.ApprovedDate,
    });
    try {
        const newTemp = await template.save();
        res.status(201).json(newTemp);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

//update template

router.put('/:id', async (req, res) => {
    try {
        // Find the template by ID
        const template = await TemplateList.findById(req.params.id);

        // Check if the template exists
        if (!template) {
            return res.status(404).json({ message: "Template Not Found" });
        }

        // Update fields only if provided in req.body
        template.Temp_id = req.body.Temp_id || template.Temp_id;
        template.Temp_name = req.body.Temp_name || template.Temp_name;
        template.Temp_category = req.body.Temp_category || template.Temp_category;
        template.Temp_status = req.body.Temp_status || template.Temp_status;
        template.CreatedBy = req.body.CreatedBy || template.CreatedBy;
        template.TestedBy = req.body.TestedBy || template.TestedBy;
        template.Approval_status = req.body.Approval_status || template.Approval_status;
        template.CompletedDate = req.body.CompletedDate || template.CompletedDate;
        template.ApprovedDate = req.body.ApprovedDate || template.ApprovedDate;

        // Update UpdatedAt timestamp if schema has timestamps enabled
        template.UpdatedAt = Date.now();

        // Save updated template
        const updatedTemp = await template.save();

        // Send back the updated template in JSON format
        res.json(updatedTemp);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


//Delete a Template Data

router.delete('/:id', async (req, res) => {
    try {
        const template = await TemplateList.findById(req.params.id);
        if(!TemplateList){
            return res.status(404).json({message: "Employee not found!"})
        }
        await TemplateList.findByIdAndDelete(template._id)
        res.json({message: `Template ${template.Temp_name} has been Deleted`})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})


// fetch template by employee
router.get('/employee/:employeeId', async (req,res) => {
    try {
        const employeeId=req.params.employeeId;
        //Validate Category Id

        const employeeExist = await Employee.findById(employeeId)
        if(!employeeExist){
           return res.status(400).json({message:'Invalid Employee Id'});
        }

        //fetch template

            const templates= await TemplateList.find({CreatedBy:employeeId}).populate('CreatedBy');
            res.status(200).json(templates)

    } catch (error) {
        res.status(500).json({message: error.message});
    }    
})


module.exports = router;
