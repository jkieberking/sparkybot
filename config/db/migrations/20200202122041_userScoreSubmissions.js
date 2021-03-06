
exports.up = function(knex) {
    return knex.schema.createTable('userScoreSubmissions', tbl => {
        tbl
            .increments('submissionId')
      
        tbl
            .string('discordId')
            .notNullable();

        tbl
            .foreign('discordId')
            .references('users.discordId');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('userScoreSubmissions');
};
