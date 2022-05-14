const express = require('express');
const router = express.Router();
const axios = require('axios');

const formatDate = require('../helpers/formatDate');

async function getUsers(id, token) {
    if (token === undefined) {
        return `Not authorize, cannot access project users`   
    }
    const res = await axios.get(`https://gitlab.com/api/v4/projects/${id}/users?access_token=${token}`)
    const json = await res.data;
    return json;
}

async function commitCount(id, token) {
    if(token === undefined) {
        return `Not authorize, cannot access project commits`
    }
    const response = await axios.get(`https://gitlab.com/api/v4/projects/${id}/repository/commits?per_page=100&access_token=${token}`)
    const json = await response.data;
    // console.log(json);
    return json;
}

async function getPipelines(id, token) {
    if (token === undefined) {
        return 'Not authorize, cannot access pipeline status'
    }

    const response = await axios.get(`https://gitlab.com/api/v4/projects/${id}/pipelines?per_page=100&access_token=${token}`)
    const json = await response.data;
    if(json.length === 0) {
        return 'No pipeline found'
    }
    return json[0];
}

router.get('', (req, res) => {
    let username = req.query.username;
    let id = req.query.id;
    let token = req.query.token;
   
    if(!username || username === ''){
        return res.send({ error: 'Missing username' });
    }

    if(!id || id === ''){
        return res.send({ error: 'Missing project id' });
    }

    axios.get(`https://gitlab.com/api/v4/users/${username}/projects?statistics=true${`${req.query.token !== undefined ? `&access_token=${req.query.token}` : ''}`}&per_page=100`)
    .then(response => {
        let project = response.data.filter(p => p.id == parseInt(req.query.id));
        
        if (response.data.length === 0) {
            res.send('<h1>User not found</h1>');
        }else {
            if(response.data.find(p => p.id === parseInt(req.query.id)) === undefined) {
                return res.send('<h1>Project not found, if project exist add access token</h1>');
            }
            project = project.reduce(j => j);
            let date = formatDate(new Date(response.data.find(p => p.id === parseInt(req.query.id)).last_activity_at), parseInt(req.query.format));

            getUsers(project.id, req.query.token).then(u => {
                commitCount(project.id, req.query.token).then(c => {
                    getPipelines(project.id, req.query.token)
                    .then(p => {
                        let data = {
                            id: project.id,
                            shortId: !req.query.token ? c : c[0].short_id,
                            commits: req.query.token === undefined ? c : c.length,
                            branch: project.default_branch,
                            stars: project.star_count,
                            topics: project.topics.length,
                            forks: project.forks_count,
                            wiki: project.wiki_enabled ? 'Enabled' : 'No wiki',
                            lastCommit: date,
                            createdAt: formatDate(new Date(response.data.find(p => p.id === parseInt(req.query.id)).created_at), parseInt(req.query.format)),
                            repositorySize: `${req.query.token === undefined ? 'No authorize cannot display this value, you need to specify access token in query string' : (response.data.find(p => p.id === parseInt(req.query.id)).statistics.repository_size / 1000000).toFixed(2) } ${req.query.token !== undefined ? 'MB' : ''}`,
                            storageSize: `${req.query.token === undefined ? 'No authorize cannot display this value, you need to specify access token in query string' : (response.data.find(p => p.id === parseInt(req.query.id)).statistics.storage_size / 1000000).toFixed(2) } ${req.query.token !== undefined ? 'MB' : ''}`,
                            snippetsSize: `${req.query.token === undefined ? 'No authorize cannot display this value, you need to specify access token in query string' : (response.data.find(p => p.id === parseInt(req.query.id)).statistics.snippets_size / 1000000).toFixed(2) } ${req.query.token !== undefined ? 'MB' : ''}`,
                            jobArtifacts: `${req.query.token === undefined ? 'No authorize cannot display this value, you need to specify access token in query string' : (project.statistics.job_artifacts_size / 1000000).toFixed(2) } ${req.query.token !== undefined ? 'MB' : ''}`,
                            totalPipelines: `${req.query.token === undefined ? 'No authorize' : p.length}`,
                            latestPipelineStatus: `${req.query.token === undefined && p.length > 0 ? p.status : p.status}`,
                            contributors: `${req.query.token === undefined ? u : parseInt(u.length)}`,
                            repositoryUrl: project.http_url_to_repo,
                            version: req.query.licence,
                        }
                        res.send(data);
                    })
                })
            })
            
        }
    })
})

module.exports = router;