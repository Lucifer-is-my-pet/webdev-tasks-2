'use strict';

var MongoClient = require('./node_modules/mongodb').MongoClient;

// доступные операции: подключение к монге, выбор коллекции, формирование запроса, получение
// результата

function createQuery(param, value, operator) {
    return "this." + param + " " + operator + " '" + value + "'";
}

var multivarka = function () {
    this.myServer = null;
    this.queryParam = null;
    this.collectionName = null;
    this.negation = false;
    this.queryText = '';
};

multivarka.prototype.server = function (serverName) {
    this.myServer = MongoClient.connect(serverName);
    return this;
};

multivarka.prototype.where = function (data) {
    this.queryParam = data;
    return this;
};

multivarka.prototype.collection = function (collectionName) {
    this.collectionName = collectionName;
    return this;
};

multivarka.prototype.equal = function (paramValue) {
    if (this.negation) {
        this.negation = false;
        this.queryText = createQuery(this.queryParam, paramValue, '!=');
    } else {
        this.queryText = createQuery(this.queryParam, paramValue, '==');
    }
    return this;
};

multivarka.prototype.lessThan = function (paramValue) {
    if (this.negation) {
        this.negation = false;
        this.queryText = createQuery(this.queryParam, paramValue, '>=');
    } else {
        this.queryText = createQuery(this.queryParam, paramValue, '<');
    }
    return this;
};

multivarka.prototype.greatThan = function (paramValue) {
    if (this.negation) {
        this.negation = false;
        this.queryText = createQuery(this.queryParam, paramValue, '<=');
    } else {
        this.queryText = createQuery(this.queryParam, paramValue, '>');
    }
    return this;
};

multivarka.prototype.not = function () {
    this.negation = true;
    return this;
};

multivarka.prototype.include = function (array) {
    if (!Array.prototype.isPrototypeOf(array)) {
        array = [array];
    }
    array.forEach((item, i) => {
        if (this.negation) {
            this.queryText += createQuery(this.queryParam, item, '!=');
            if (i < array.length - 1) {
                this.queryText += " && ";
            } else {
                this.negation = false;
            }
        } else {
            this.queryText += createQuery(this.queryParam, item, '==');
            if (i < array.length - 1) {
                this.queryText += " || ";
            }
        }
    });
    return this;
};

multivarka.prototype.find = function () {
    var text = this.queryText;
    return this.myServer.then((db) => {
        return db.collection(this.collectionName).find({
            $where: text
        }, { _id: 0 }).toArray().then(function (data) {
            db.close();
            return Promise.resolve(data);
        });
    });
};

module.exports = multivarka;
