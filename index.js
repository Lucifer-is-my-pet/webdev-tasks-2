const multivarka = require('./multivarka');

new multivarka()
    .server('mongodb://localhost/urfu-2015')
    .collection('students')
    .where('group').equal('ФИИТ-301')
    .find().then(function (data) {
        console.log(data);
        console.log('---------');
    }).catch(function (err) {
        console.error(err);
    });

new multivarka()
    .server('mongodb://localhost/urfu-2015')
    .collection('students')
    .where('grade').not().lessThan(4)
    .find().then(function (data) {
        console.log(data);
        console.log('---------');
    }).catch(function (err) {
        console.error(err);
    });

