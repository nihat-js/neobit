"use strict";
const { apiBuilderGet, apiBuilderGetById } = require("../apiBuilder/get");
const { apiBuilderPost } = require("../apiBuilder/post");
const { apiBuilderDeleteById } = require("../apiBuilder/delete");
function apiBuilderFromArray({ name, arr, prefix = "/" }) {
    apiBuilderGet.call(this, { name, prefix, arr });
    apiBuilderGetById.call(this, { name, prefix, arr });
    apiBuilderPost.call(this, { name, prefix, arr });
    apiBuilderDeleteById.call(this, { name, prefix, arr });
}
function apiBuilderFromObject() {
    // for (let key in object)
}
module.exports = {
    apiBuilderFromObject,
    apiBuilderFromArray
};
