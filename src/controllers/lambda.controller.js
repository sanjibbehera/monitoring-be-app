const { lambdaService } = require('../services');

const saveLambdaList = async (req, res) => {
    const data = await lambdaService.getLambdaList();

    res.send({ data });
}

module.exports = { saveLambdaList }