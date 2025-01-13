const express = require("express");

const contactController = {
    getContact: (req, res) => {
        return res.status(200).render("pages/contact");
    },
};
module.exports = contactController;
