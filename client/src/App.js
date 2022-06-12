import React, { useEffect,useState } from "react";
import ImageUpload from "./contracts/ImageUpload.json";
import getWeb3 from "./getWeb3";
// import { create } from 'ipfs-http-client'
import "./App.css";


var ipfsAPI = require('ipfs-api')
var ipfs = ipfsAPI({host:'ipfs.infura.io', port:'5001', protocol: 'http'}) // leaving out the arguments will default to these values


function App()
{
  const [web3,setWeb3]=useState(null);
  const [accounts,setAccounts]=useState(null);
  const [contract,setContract]=useState(null);
  const [buffer,setBuffer]=useState(null);
  const [hashed,setHashes]=useState([]);

  const web3Load=async()=>{
    try {
      const web3_js = await getWeb3();
      setWeb3(web3_js);
      const User_account = await web3_js.eth.getAccounts();
      const networkId = await web3_js.eth.net.getId();
      const deployedNetwork = ImageUpload.networks[networkId];
      
      const instance = await new web3_js.eth.Contract(
        ImageUpload.abi,
        deployedNetwork && deployedNetwork.address,
      );
      await setContract(instance)
      await setAccounts(User_account)
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  const CreateAccount=async()=>{
    // alert("Create Acc Called");
    if(contract!=null && accounts!=null)
    {
      // alert("Got contract:",contract);
      // alert(accounts)
      var isAccount=await contract.methods.isCreated().call({from:accounts[0]});
      // alert(isAccount)
      if(!isAccount)
      {
        // alert("Got Account");
        await contract.methods.create("Harish").send({from:accounts[0]});
      }
      else{
        let listOfHashes=await contract.methods.getImage_Hashes().call({from:accounts[0]})
        setHashes(listOfHashes)
        // alert("Hash:",listOfHashes)
      }
    }
    else{
      
    }
  }

  const capturefile=(event)=>{
    event.preventDefault();
    const file =event.target.files[0]
    const reader= new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend=()=>{
      setBuffer(Buffer.from(reader.result))
    }
  }
  const onSubmit=async(event)=>{
    event.preventDefault();
    alert(buffer)
    console.log("Submitting File");
    if(buffer){
      ipfs.files.add(buffer,(error,result)=>{
        if(error)
        {
          alert("error: ",error)
        }
        else{
          alert("result: ",result)
          console.log(result)
          const ImageHash=result[0]["hash"]
          contract.methods.Push_toList(ImageHash).send({from:accounts[0]}).then((r)=>{
            setHashes(arr => [...arr, ImageHash]);
          })
      }
      })
    }
  }
  
  useEffect(async()=>{
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
    web3Load();
    if(contract!=null && accounts!=null)
    {
      // alert(contract);
      CreateAccount();
    }
    
  },[contract,accounts])


  

  return (
    <div class="container">
    <div class="row">
      <div class="col-12"> <center>Homepage</center> </div>
    </div>

    <div class="row">
      <div class="col-6">Welcome  {accounts} </div>
    </div>

    <div class="row">
      <div class="col-6">
        <from>
          <input id="input-b2" name="input-b2" type="file" onChange={capturefile} class="file" data-show-preview="false"/>
          <button onClick={onSubmit}>Submit</button>
          
        </from>
        </div>
      <div class="col-6">
        <row>
        {hashed.map( e =>
          <img style={{
            width: "200px",
            height: "300px",
            objectFit: "contain"
          }} src={`https://ipfs.io/ipfs/${e}`} alt="logo"/>
          
        )}
        </row>
      </div>
    </div>

  </div>

  );

}

export default App;