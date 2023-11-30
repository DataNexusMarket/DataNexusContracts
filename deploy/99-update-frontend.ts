import { frontEndContractsFile, frontEndAbiLocation } from "../helper-hardhat-config"
import "dotenv/config"
import fs from "fs"
import { network, ethers } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const updateFrontEnd: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("ABI(s) & Contract Addresse(s) updated.")
    }
}

async function updateAbi() {
    const dataListingFactory = await ethers.getContract("DataListingFactory")

    fs.writeFileSync(
        `${frontEndAbiLocation}DataListingFactory.json`,
        dataListingFactory.interface.formatJson()
    )
}

async function updateContractAddresses() {
    const chainId = network.config.chainId!.toString()
    const dataListingFactory = await ethers.getContract("DataListingFactory")

    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))

    const addr = dataListingFactory.target

    if (chainId in contractAddresses) {
        contractAddresses[chainId]["DataListingFactory"] = [addr]
    } else {
        contractAddresses[chainId] = [{ DataListingFactory: addr }]
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

export default updateFrontEnd
updateFrontEnd.tags = ["all", "frontend"]
