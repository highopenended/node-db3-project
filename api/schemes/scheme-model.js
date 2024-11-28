const knex = require("../../data/db-config");

function find() {
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
        .then(([id]) => {
            return knex("schemes").where("scheme_id", id).first();
        });
}

function addStep(scheme_id, step) {
    step.scheme_id = scheme_id;
    return knex("steps")
        .insert(step)
        .then(() => {
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
