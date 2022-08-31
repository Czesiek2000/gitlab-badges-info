const express = require('express');
const router = express.Router();

const fetchData = require('../helpers/fetch');

router.get('', async (req, res) => {
    let username = req.query.username;
    let id = req.query.id;
    let token = req.query.token;

    if (!username || username === '') {
        return res.send({ error: 'Missing username' });
    }

    if (!id || id == '') {
        return res.send({ error: 'Missing project id' });
    }
    
    let projects = await fetchData(`https://gitlab.com/api/v4/users/${username}/projects?statistics=true${`${token !== undefined ? `&access_token=${token}` : ''}`}&per_page=100`);
    let languages, users, commits, pipelines;
    if (token) {
        languages = await fetchData(`https://gitlab.com/api/v4/projects/${id}/languages?access_token=${token}`);
        users = await fetchData(`https://gitlab.com/api/v4/projects/${id}/users?access_token=${token}`);
        commits = await fetchData(`https://gitlab.com/api/v4/projects/${id}/repository/commits?access_token=${token}`);
        pipelines = await fetchData(`https://gitlab.com/api/v4/projects/${id}/pipelines?access_token=${token}`);
    }
    
    let project = projects.find(p => p.id == id);
    if (project === undefined) {
        res.send({ error: 'Project not found, mayby try passing token' });
        return
    }
    
    const { name, description, statistics, default_branch, forks_count, star_count, wiki_enabled, visibility } = project;
    
    res.send({
        id,
        commitId: token ? commits[0].id : 'Cannot get commit id without token',
        commitShortId: token ? commits[0].short_id : 'Cannot get commit short id without token',
        name,
        description,
        commits: token ? statistics.commit_count : `Cannot fetch statistics. Please provide a token.`,
        forks: forks_count,
        stars: star_count,
        branch: default_branch,
        wiki: token ? (wiki_enabled ? 'enabled' : 'disabled') : 'Cannot fetch wiki status. Please provide a token.',
        pipelines: token ? pipelines.length : 'Cannot fetch pipelines. Please provide a token.',
        languages: token ? languages : 'Cannot fetch languages. Please provide a token.',
        status: token && pipelines.length != 0 ? pipelines[0].status : 'Cannot fetch pipelines. Please provide a token.',
        pipelineStatus: token && pipelines.length != 0 ? pipelines[0].status : 'Token is not passed or this project has no pipelines.',
        visibility,
    });
})



module.exports = router;
