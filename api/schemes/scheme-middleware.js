const Schemes = require("./scheme-model.js");

const checkSchemeId = async (req, res, next) => {
    const id = req.params.scheme_id;
    try {
        const scheme = await Schemes.findById(id);
        if (scheme === null) {
            return res.status(404).json({ message: `scheme with scheme_id ${id} not found` });
        } else {
            next();
        }
    } catch (err) {
        return res.status(404).json({
            message: `scheme with scheme_id ${id} not found`,
        });
    }
};

const validateScheme = (req, res, next) => {
    const schemeName = req.body.scheme_name;
    if (schemeName !== null && schemeName !== "" && typeof schemeName === "string") {
        req.scheme = { scheme_name: schemeName };
        next();
    } else {
        return res.status(400).json({
            message: "invalid scheme_name",
        });
    }
};

const validateStep = (req, res, next) => {
    console.log(req.body);
    const { instructions, step_number } = req.body;
    if (
        instructions !== null &&
        instructions !== "" &&
        typeof instructions === "string" &&
        !isNaN(step_number) &&
        step_number >= 1
    ) {
        req.step = { step_number, instructions };
        next();
    } else {
        return res.status(400).json({
            message: "invalid step",
        });
    }
};

module.exports = {
    checkSchemeId,
    validateScheme,
    validateStep,
};
