'use strict';
module.exports = function(app) {
  const offers = require('../controllers/offersController');

  // offers Routes
  app.route('/tasks')
    .get(offers.list_all_tasks)
    .post(offers.create_a_task);


  app.route('/tasks/:taskId')
    .get(offers.read_a_task)
    .put(offers.update_a_task)
    .delete(offers.delete_a_task);
};
