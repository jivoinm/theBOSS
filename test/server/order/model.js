'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    Order = mongoose.model('Order');

var order;
function CreateProject(ownerName, projectName, done) {
    var project = new Project({
        owner: ownerName,
        name: projectName,
        fields: [
            {
                field_order: 1,
                field_title: 'Field name1',
                field_type: 'text',
                field_value: '',
                field_require: true
            },
            {
                field_order: 1,
                field_title: 'Field name1',
                field_type: 'text',
                field_value: '',
                field_require: true
            }
        ],
        tasks: [
            {
                priority: 2,
                title: 'Task2',
                duration: '2h'
            },
            {
                priority: 1,
                title: 'Task1',
                duration: '1h'
            },
            {
                priority: 3,
                title: 'Task3',
                duration: '1h'
            },
        ]
    });
    project.save(done);
}
function CreateOrder(ownerName, customer, project, done) {
    var order = new Order({
        owner: ownerName,
        customer: customer,
        projects: [
            {
                project: project,
                field_values: [
                    {
                        'Field name1': 'field1 value'
                    }
                ]
            }
        ],
        tasks: [
            {
                title: 'Task1',
                assigned_to: 'User1'
            }
        ]
    });
    order.save(done);
}

describe('Order server tests', function () {
    beforeEach(function (done) {
        CreateProject('Owner1', 'Project1', function () {
            CreateProject('Owner1', 'Project2', function () {
                CreateProject('Owner2', 'Project1', function () {
                    //create orders

                    //CreateOrder('Owner1',);
                })
            })
        });
    });
});