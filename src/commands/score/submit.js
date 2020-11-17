const dbUser = require('../../db/users');
const dbScenarios = require('../../db/scenarios')
const helper = require('../../lib/helper');
const scenarios = require('../../db/scenarios')

const usage = `
    usage:
    s-submit [1st scenario name/id?] [1st score] [1st screenshot/video link]
    [2cnd scenario name/id?] [2cnd score] [2cnd screenshot/video link]
    ...etc
`

async function submitScores(message, command, args) {
    return;
    // temp code
    if (command === 'submit') {
        const userString = helper.userStringFromMessage(message);
        const submissionFailed = userString + ' submission failed, '
        const submissions = message.guild.channels.cache.find(channel => channel.name === 'submit');
        if (message.channel.name !== 'submit') {
            message.channel.send(submissionFailed + 'please submit in ' + submissions);
            return;
        }
        if (!dbUser.getByDiscordId(message.author.id)) {
            dbUser.insert(message.author.id, message.author.username);
        }

        let invalidSubmit = await validateScoreSubmissions(args);
        if (invalidSubmit) {
            message.channel.send(userString + ' ' + invalidSubmit);
        }

    }
}

async function validateScoreSubmissions(submissions) {
    const scenariosMap = await scenarios.getAll();
    let message = checkSubmitLength(submissions);
    if ('' !== message) {
        return message;
    }
    message = await checkPartsOfSubmissions(submissions);
    if ('' !== message) {
        return message
    }

    return '';
}

function checkSubmitLength(submissions) {
    if (submissions.length === 0) {
       return usage;
    }

    if (submissions.length >= 100) {
        return 'too many submissions at once';
    }

    if (submissions.length % 3 !== 0) {
        return 'missing either a scenario name, score, or proof somewhere in your submission';
    }

    return '';
}

async function checkPartsOfSubmissions(submissions) {
    message = await checkScenarioIdentifiers(submissions)
    if ('' !== message) {
        return message;
    }

    message = checkScore(submissions)
    if ('' !== message) {
        return message;
    }

    message = checkProof(submissions)
    if ('' !== message) {
        return message;
    }

    return '';
}

async function checkScenarioIdentifiers(submissions) {
    const scenariosList = await dbScenarios.getAll();
    const notFound = [];
    for (let i = 0; i < submissions.length; i += 3) {
        let currentId = submissions[i];
        const foundId = scenariosList.filter((val) => {
            if (val['scenarioName'] == currentId) {
                return true;
            }

            if (val['scenarioId'] == currentId) {
                return true;
            }

            return false
        })
        if (foundId.length === 0) {
            notFound.push(currentId);
        }
    }

    if (notFound.length !== 0) {
        return `scenarios: ${notFound.join(', ')} are invalid scenarios\n`
    }

    return '';
}

function checkScore(submissions) {
    const invalidScoreStrings = []
    for (let i = 1; i < submissions.length; i += 3) {
        let currentScore = +submissions[i];

        if (isNaN(currentScore)) {
            invalidScoreStrings.push(`score for scenario ${submissions[i - 1]} must be an integer\n`);
        }

        if (currentScore <= 0) {
            invalidScoreStrings.push(`score for scenario ${submissions[i - 1]} can't be less than or equal to 0\n`);
        }

        if (currentScore >= 1000000) {
            invalidScoreStrings.push(`score for scenario ${submissions[i - 1]} is too large\n`);
        }
    }

    if (invalidScoreStrings.length !== 0) {
        return invalidScoreStrings.join('');
    }


    return '';
}

function checkProof(submissions) {
    let imgurRegex = /https:\/\/i.imgur.com/;
    for (let i = 2; i < submissions.length; i += 3) {
        let currentProof = submissions[i];
    }
}

module.exports = { submitScores };