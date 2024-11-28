const knex = require("../../data/db-config");

function find() {
    // EXERCISE A

    return knex("schemes as sc")
        .select("sc.*")
        .count({ number_of_steps: "st.step_id" })
        .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
        .groupBy("sc.scheme_id")
        .orderBy("sc.scheme_id", "asc");
}

function findById(scheme_id) {
    return knex("schemes as sc")
        .select("sc.scheme_id", "sc.scheme_name", "st.step_id", "st.step_number", "st.instructions")
        .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
        .where("sc.scheme_id", scheme_id)
        .orderBy("st.step_number", "asc")
        .then((rows) => {
            if (rows.length === 0) {
                // Handle case when no scheme exists
                return null;
            }

            // Extract scheme information from the first row
            const scheme = {
                scheme_id: rows[0].scheme_id,
                scheme_name: rows[0].scheme_name,
                steps: rows
                    .filter((row) => row.step_id) // Exclude rows without steps
                    .map((row) => ({
                        step_id: row.step_id,
                        step_number: row.step_number,
                        instructions: row.instructions,
                    })),
            };

            return scheme;
        });
}

function findSteps(scheme_id) {
    return knex("steps as st")
        .select("st.step_id", "st.step_number", "st.instructions", "sc.scheme_name")
        .leftJoin("schemes as sc", "st.scheme_id", "sc.scheme_id")
        .where("sc.scheme_id", scheme_id)
        .orderBy("st.step_number", "asc")
        .then((rows) => {
            return rows.length > 0 ? rows : [];
        });
}

function add(scheme) {
    return knex("schemes")
        .insert(scheme)
        .returning("*")
        .then(([newScheme]) => newScheme);
}

function addStep(scheme_id, step) {
    // EXERCISE E
    /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
    // Add the scheme_id to the step object
    step.scheme_id = scheme_id;
    
    return knex("steps")
        .insert(step)
        .then(() => {
            // After inserting, retrieve all steps for the scheme
            return knex("steps")
                .select("step_id", "step_number", "instructions", "scheme_id")
                .where("scheme_id", scheme_id)
                .orderBy("step_number", "asc");
        });
}

module.exports = {
    find,
    findById,
    findSteps,
    add,
    addStep,
};
