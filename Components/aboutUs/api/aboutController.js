const express = require("express");

const contactController = {
    getAboutUs: (req, res) => {
        return res.status(200).render("pages/aboutUs");
    },
};
module.exports = contactController;
