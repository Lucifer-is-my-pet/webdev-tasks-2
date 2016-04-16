const multivarka = require('./multivarka')();

multivarka
    .server('mongodb://localhost/urfu-2015')
    .collection('students')
    .where('group').not().include(['ФИИТ-301', 'ПИ-401'])
    .find().then(function (data) {
        console.log(data);
        console.log('---------');
    }).catch(function (err) {
        console.error(err);
    });

multivarka
    .server('mongodb://localhost/urfu-2015')
    .collection('students')
    .where('grade').not().lessThan(4)
    .find().then(function (data) {
        console.log(data);
        console.log('---------');
    }).catch(function (err) {
        console.error(err);
    });

multivarka
    .server('mongodb://localhost/urfu-2015')
    .collection('students')
    .find().then(function (data) {
        console.log(data);
        console.log('---------');
    }).catch(function (err) {
        console.error(err);
    });

multivarka
    .server('mongodb://localhost/urfu-2015')
    .collection('students')
    .where('grade').greatThan(2).where('group').equal('ПИ-401')
    .find().then(function (data) {
        console.log(data);
        console.log('---------');
    }).catch(function (err) {
        console.error(err);
    });

multivarka
    .server('mongodb://localhost/urfu-2015')
    .collection('students')
    .where('grade').greatThan(2).where('grade').lessThan(4)
    .find().then(function (data) {
        console.log(data);
        console.log('---------');
    }).catch(function (err) {
        console.error(err);
    });

multivarka
    .server('mongodb://localhost/urfu-2015')
    .collection('students')
    .where('grade').not().equal(3).where('group').include(['ПИ-401', 'ПИ-201', 'МТ-201'])
    .find().then(function (data) {
        console.log(data);
        console.log('---------');
    }).catch(function (err) {
        console.error(err);
    });
