const { network } = require("hardhat");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("NFTContract", {
    from: deployer,
    log: true,
    args: [
      "0xb39ea31b5891d1ab6e73982471cfebbca36a3f4fd2434ab46e26e7d2e42fa205",
      "0xacbf5b2b551a07a0a73f63960e7e30f39399a6077b663674db70b971d5da1f8b",
      12000,
      1500,
    ],
  });
};
module.exports.tags = ["all", "NFTContract"];
