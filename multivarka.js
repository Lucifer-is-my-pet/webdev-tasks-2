'use strict';

var MongoClient = require('mongodb').MongoClient;

function negate(value) {
    switch (value) {
        case '$lt':
            return '$gte';
        case '$gt':
            return '$lte';
        case '$eq':
            return '$ne';
        case '$in':
            return '$nin';
    }
}

function simpleQuery(param, func, value) {
    var obj = {};
    obj[func] = value;
    
    var result = {};
    result[param] = obj;

    return result;
}

function multivarka() {
    if (!(this instanceof multivarka)) {
        return new multivarka();
    }
    this.myServer = null;
    this.collectionName = null;
    this.counter = -1;
    this.params = [];
    this.functions = [];
    this.negations = [];
    this.values = [];
}

multivarka.prototype.clear = function () {
    this.counter = -1;
    this.params = [];
    this.functions = [];
    this.negations = [];
    this.values = [];
};

multivarka.prototype.createQuery = function () {
    var result = {};
    if (this.counter === -1) {
    } else if (this.counter === 0) {
        var func;
        if (this.negations[0]) {
            func = negate(this.functions[0]);
        } else {
            func = this.functions[0];
        }
        result = simpleQuery(this.params[0], func, this.values[0]);
    } else {
        result = {$and : []};
        for (let i = 0; i <= this.counter; i++) {
            var func;
            if (this.negations[i]) {
                func = negate(this.functions[i]);
            } else {
                func = this.functions[i];
            }
            result['$and'].push(simpleQuery(this.params[i], func, this.values[i]))
        }
    }
    return result;
};

multivarka.prototype.server = function (serverName) {
    this.myServer = MongoClient.connect(serverName);

    return this;
};

multivarka.prototype.collection = function (collectionName) {
    this.clear();
    this.collectionName = collectionName;

    return this;
};

multivarka.prototype.where = function (data) {
    this.counter++;
    this.params.push(data);

    return this;
};

multivarka.prototype.equal = function (paramValue) {
    this.values.push(paramValue);
    this.functions.push('$eq');

    return this;
};

multivarka.prototype.lessThan = function (paramValue) {
    this.values.push(paramValue);
    this.functions.push('$lt');

    return this;
};

multivarka.prototype.greatThan = function (paramValue) {
    this.values.push(paramValue);
    this.functions.push('$gt');

    return this;
};

multivarka.prototype.not = function () {
    this.negations[this.counter] = true;

    return this;
};

multivarka.prototype.include = function (array) {
    this.functions.push('$in');
    if (!Array.prototype.isPrototypeOf(array)) {
        array = [array];
    }
    this.values.push(array);

    return this;
};

multivarka.prototype.find = function () {
    var query = this.createQuery();

    return this.myServer.then((db) => {
        return db.collection(this.collectionName).find(query,
            { _id: 0 }).toArray().then(function (data) {
            db.close();
            return Promise.resolve(data);
        });
    });
};

module.exports = multivarka;
