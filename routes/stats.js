const express = require('express');
const axios = require('axios');
const router = express.Router();
const formatDate = require('../helpers/formatDate');


router.get('', (req, res) => {
    let username = req.query.username;
    if (username === undefined || req.query.id === undefined) {
        return res.send({ error: 'Missing parameters' });
    }
    axios.get(`https://gitlab.com/api/v4/users/${username}/projects?statistics=true${`${req.query.token !== undefined ? `&access_token=${req.query.token}` : ''}`}&per_page=100`).then(response => {
        // console.log(response.data);
        let id = response.data.find(p => p.id == req.query.id).id;
        let project = response.data.find(p => p.id == req.query.id);
        let svg = `
        <svg width="400" height="150">
            <g>
                <rect width="400" height="150" style="fill:rgb(255,255,255);stroke-width:3;stroke:rgb(0,0,0)" />
                <text x="30" y="20" font-size="23" font-family="Verdana" font-weight="bold" fill="black">${username}'s Gitlab stats</text>
                <text x="20" y="50" font-size="16" font-family="Verdana" font-weight="bold" fill="black" padding="10px">Id: ${id}</text>
                <text x="20" y="70" font-size="16" font-family="Verdana" font-weight="bold" fill="black" padding="10px">Stars: ${project.star_count}</text>
                <text x="20" y="90" font-size="16" font-family="Verdana" font-weight="bold" fill="black" padding="10px">Forks: ${project.forks_count}</text>
                <text x="20" y="110" font-size="16" font-family="Verdana" font-weight="bold" fill="black" padding="10px">Last active: ${formatDate(project.last_activity_at, req.query.format || 1)}</text>
            </g>
            <g>
            <circle x="30" y="40" width="50" height="50" stroke="black" stroke-width="3" />
            <text x="300" y="70" font-size="23" font-family="Verdana" font-weight="bold" fill="black">${project.name.charAt(0).toUpperCase()}</text>
            </g>
        </svg>`
        res.send(svg)   
    })
})

module.exports = router;