import { patract, network } from 'redspot';

const { getContractFactory } = patract;
const { createSigner, keyring, api } = network;

const uri =
  'bottom drive obey lake curtain smoke basket hold race lonely fit walk//Alice';

async function run() {
  await api.isReady;

  const signer = createSigner(keyring.createFromUri(uri));
  const contractFactory = await getContractFactory('stakepool', signer);

  const balance = await api.query.system.account(signer.address);
  console.log('Balance: ', balance.toHuman());

  const cusdContractFactory = await getContractFactory('pat_standard', signer);
  const cusdContract = await cusdContractFactory.deployed('IPat,new', '0', 'Coinversation USD Token', 'Cusd', '6', {
    gasLimit: '200000000000',
    value: '0',
    salt: 'Cusd Token'
  });
  console.log(
    'Deploy Cusd successfully. The contract address: ',
    cusdContract.address.toString()
  );
  console.log('');

  const ctoContractFactory = await getContractFactory('pat_standard', signer);
  const ctoContract = await ctoContractFactory.deployed('IPat,new', '10000000000000000', 'Coinversation Token', 'CTO', '10', {
    gasLimit: '200000000000',
    value: '0',
    salt: 'CTO Token'
  });
  console.log(
      'Deploy CTO successfully. The contract address: ',
      ctoContract.address.toString()
  );
  console.log('');

  const contract = await contractFactory.deployed('new', cusdContract.address, ctoContract.address,{
    gasLimit: '200000000000',
    value: '0',
    salt: 'CollateralManger'
  });
  console.log(
    'Deploy stakepool ( Collateral Manger ) successfully. The contract address: ',
    contract.address.toString()
  );

  // transfer cusd contract ownership to stakepool ( Collateral Manger )
  await cusdContract.tx['ownable,transferOwnership'](contract.address.toString())

  api.disconnect();
}

run().catch((err) => {
  console.log(err);
});
