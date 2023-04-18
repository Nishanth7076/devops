import React, { useEffect, useState } from 'react';
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBContainer,
  MDBIcon,
  MDBSwitch,
  MDBCol,
  MDBRow, MDBInputGroup,
  MDBCard, MDBCardText, MDBCardBody, MDBBtn, MDBTypography,MDBListGroup, MDBListGroupItem, MDBInput, MDBTooltip,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';
import Cards from 'react-credit-cards';
import 'react-credit-cards/dist/es/styles-compiled.css';
import Forms from './Components/LoginSignUp';
import { useCookies } from 'react-cookie';

export default function App() {
  const [justifyActive, setJustifyActive] = useState('tab1');
  const [showCVV, setShowCVV] = useState('name');
  const [isVerfied, setIsVerified] = useState(false);
  const [centredModal, setCentredModal] = useState(false);
  const [depositValue, setDepositValue] = useState();
  const [onlineTransactions, setOnlineTransactions] = useState(false); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [accountNumber, setAccountNumber] = useState();
  const [accountName, setAccountName] = useState();
  const [cookies, setCookie] = useCookies(['isLogIn', 'email', 'authkey']);

  const togglePasswordModal = () => setPasswordModal(!passwordModal)
  const toggleShow = () => setCentredModal(!centredModal);
  const transactions = [{
    'date':'04-03-2023',
    'desc':'Transfer/Acc/09089909098',
    'amount':'100',
    'type':'Dr'
  }
]

useEffect(()=>{
  if(cookies.isLogIn === 'true'){
    var data = {
      email : cookies.email,
      password : cookies.authkey
    }
    login(data)
  }    
}, [cookies.isLogIn])

const transferInitialState = {
  senderemail : '',
  amount:'',
  recipientemail:''
}

const [transferDetails, setTransferDetails] = useState(transferInitialState)

async function setTransfer(key, value) {
  setTransferDetails({ ...transferDetails, [key]: value })
}

const [remail, setREmail] = useState('')

const [statement, setStatement] =useState(transactions)

  const initialState = {
      email: '',
      accountNumber: '',
      balance: '',
      cardNumber: '',
      cvv: '',
      expiry: '',
      name: '',
      onlineTransactions: "false",
  }

  function login(data){
    console.log(data)
    setCookie('email', data.email, {path:'/', maxAge: 900})
    setCookie('authkey', data.password, {path:'/', maxAge: 900})
    fetch('https://212utffvc3.execute-api.us-west-2.amazonaws.com/Prod/login', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
      console.log(response)
        if(response.isLoginSuccessful){
          setIsLoggedIn(true)
          setUserState(response.userInfo)
          setStatement(response.statement)
          const semail =  response.userInfo.email
          setTransfer('senderemail', semail)
          setCookie('isLogIn', true, {path:'/', maxAge: 900})
          if(response.userInfo.onlineTransactions === "true" ){
          setOnlineTransactions(true)
        }
        }
        else{
          alert("Login Failed, Please check your email and password")
        }
    })
  }

  const [userState, setUserState] = useState(initialState)

  async function setUser(key, value) {
    setUserState({ ...userState, [key]: value })
}

  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }
    setJustifyActive(value);
  };

  const showcvv = ()=>{
    if(showCVV === 'name'){
      setShowCVV('cvc')
    }
    if(showCVV === 'cvc'){
      setShowCVV('name')
    }
  }

  const checkDeposit = (e) =>{
    const value = e.target.value;
    if(!isNaN(value) && value < 2001){
      setDepositValue(value)
    }
  }

  var recipientEmail = ""

  const verify = () =>{
    
    fetch('https://212utffvc3.execute-api.us-west-2.amazonaws.com/Prod/verifyaccount', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(accountNumber)
    })
    .then(response => response.json())
    .then(response => {
      console.log(response)
        if(response.userExists){
          setAccountName(response.userName);
          setIsVerified(true)
          const a = response.userEmail
          setTransfer('senderemail', userState.email)
          setTransfer('recipientemail', a)
        }
        else{
        setIsVerified(false);
        setAccountName('')
        } 
    })
  }

  const getStatement = () =>{
    fetch('https://212utffvc3.execute-api.us-west-2.amazonaws.com/Prod/getstatement', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify()
    })
    .then(response => response.json())
    .then(response => {
      console.log(response)
      setStatement(response)
    })
  }
  
  const tranferMoney = () =>{
    
    console.log(transferDetails)  
    fetch('https://212utffvc3.execute-api.us-west-2.amazonaws.com/Prod/transfer', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(transferDetails)
    })
    .then(response => response.json())
    .then(response => {
        if(response.isTransferSuccessful){
          getStatement();
          setUser('balance', response.senderBalance)
          alert("Transfer Successful")
        }
        else{
          alert("There is some issue with the transaction, please try again")
        }
    })
  }

  return (

    <>
    
    {
      !isLoggedIn ? <Forms doLogin={login}/> :
    <MDBContainer>
      <MDBContainer className="container py-5 h-100">
      <MDBModal tabIndex='-1' show={centredModal} setShow={setCentredModal}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Deposit Money</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <p>
                You can deposit maximum of 2000€ in a single transaction.
              </p>
              <MDBRow >
                    <MDBCol className="justify-content-center" md="12" xl="8">
                    <MDBInput label='Amount' value={depositValue} type='text' onChange={(e)=>{checkDeposit(e)}} />
                    </MDBCol>
                    <MDBCol xl="2">
                    <MDBBtn rounded size="lg" onClick={()=>{
                      
                    }}>
                 Deposit
                </MDBBtn>
                    </MDBCol>
                  </MDBRow>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      <MDBModal tabIndex='-1' show={passwordModal} setShow={setPasswordModal}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Change Password</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={togglePasswordModal}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody className='py-4 justify-content-center'>
            <MDBInput label='Old Password' type='text' onChange={(e)=>{checkDeposit(e)}} /><br/>
            <MDBInput label='New Password' type='text' onChange={(e)=>{checkDeposit(e)}} /><br/>
            <MDBInput label='Re-enter New Password' type='text' onChange={(e)=>{checkDeposit(e)}} /><br/>
            <MDBBtn rounded size="lg">
                 Confirm
                </MDBBtn>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>


        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol>
            <MDBCard style={{ borderRadius: '15px' }}>
              <MDBCardBody className="text-center">
              <MDBRow>
              <MDBCol md="12" xl="4">
              <MDBTypography tag="h4">{userState.name}</MDBTypography>
                <MDBCardText className="text-muted mb-4">
                  Checkings Account <span className="mx-2">|</span> Acc.No : {userState.accountNumber}
                </MDBCardText>
                </MDBCol>

                <MDBCol md="12" xl="4">
                <div>
                  <MDBRow>
                    <MDBCol xl='3'>

                    </MDBCol>
                    <MDBCol className='justify-content-center' xl='4'>
                    <MDBCardText className="mb-1 h5">{userState.balance}€</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Available Balance</MDBCardText>
                    </MDBCol>
                    <MDBCol xl='1'>
                    
                    <MDBBtn size='sm' onClick={toggleShow}>
                    <MDBIcon icon='plus' />
                    </MDBBtn>
      
                    
                    </MDBCol>
                  </MDBRow>
                  </div>
                </MDBCol>
                <MDBCol className='justify-content-between' xl="4">
                <MDBBtn rounded size="lg" onClick={togglePasswordModal}>
                  Change Password
                </MDBBtn>
                <MDBBtn rounded size="lg" onClick={()=>{setCookie('isLogIn', false, {path:'/'});setIsLoggedIn(false)}}>
                  Log out
                </MDBBtn>
                
                </MDBCol>
              </MDBRow>
                
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <MDBTabs justify className='mb-3'>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
          <MDBIcon fas icon='exchange-alt' className='me-2' /> Money Transfer
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
          <MDBIcon fas icon='credit-card' className='me-2' /> Debit Card Details
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab3')} active={justifyActive === 'tab3'}>
          <MDBIcon fas icon='newspaper' className='me-2' /> Statement
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={justifyActive === 'tab1'}>
        <div className='d-flex justify-content-center'>
        <MDBContainer className="container py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol md="12" xl="6">
            <MDBCard style={{ borderRadius: '15px' }}>
              <MDBCardBody className="text-center">
                <MDBTypography tag="h4">Enter the Account Number of the Recipient</MDBTypography>
                <MDBCardText className="text-muted py-5">
                  <MDBRow className="justify-content-center">
                    <MDBCol className="justify-content-center" md="12" xl="8">
                    <MDBInput onChange={(e)=>{setAccountNumber(e.target.value)}} label='Account Number' id='form1' type='text' />
                    </MDBCol>
                    <MDBCol xl="2">
                    <MDBBtn rounded size="lg" onClick={()=>{
                      verify();
                    }}>
                 Verfiy
                </MDBBtn>
                    </MDBCol>
                  </MDBRow>
                  <br/>
                  <MDBRow className="justify-content-center">
                    <MDBCol className="justify-content-center" md="12" xl="8">
                    <MDBInput value={accountName} label='Name of the Recipient' id='formControlDisabled' type='text' disabled />
                    </MDBCol>
                    <MDBCol xl="2">

                    </MDBCol>
                    </MDBRow>
                    <br/>
                    {
                      isVerfied ?
                      (
                      <>
                      <MDBRow className="justify-content-center">
                      <MDBCol className="justify-content-center" md="12" xl="4">
                      <MDBInput label='Amount' id='form1' type='text' onChange={(event)=>{setTransfer('amount',event.target.value)}}/>
                      </MDBCol>
                      <MDBCol xl="6">
                      
                      </MDBCol>
                      </MDBRow>
                      <br/>
                      <MDBBtn rounded size="lg" onClick={()=>{ tranferMoney()}}>
                   Transfer
                  </MDBBtn>
                  </>) :
                  (<>
                  <MDBRow className="justify-content-center">
                    <MDBCol className="justify-content-center" md="12" xl="4">
                    <MDBInput label='Amount' id='form1' type='text' disabled onChange={event=>{setTransfer('amount', event.target.value)}} value={transferDetails.amount}/>
                    </MDBCol>
                    <MDBCol xl="6">
                    
                    </MDBCol>
                    </MDBRow>
                    <br/>
                    <MDBBtn rounded size="lg" disabled>
                 Transfer
                </MDBBtn>
                  </>)
                    }
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      </div>
        </MDBTabsPane>
        <MDBTabsPane show={justifyActive === 'tab2'}>
        <div className='d-flex justify-content-center'>
        <MDBContainer className="container py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol md="12" xl="6">
            <MDBCard style={{ borderRadius: '15px' }}>
              <MDBCardBody className="text-center">
              <div id="PaymentForm" className="text-center">
        <Cards
          cvc={userState.cvv}
          expiry={userState.expiry}
          focused={showCVV}
          name={userState.name}
          number={userState.cardNumber}
        />
      </div>
      <br/>
      <div className='d-flex justify-content-center'>
           <MDBSwitch id='flexSwitchCheckDefault' label='Show CVV' onChange={()=>{showcvv()}}/>
           
           
      </div>
      <br/>
      <div className='d-flex justify-content-center'>
        {
          onlineTransactions ? <MDBSwitch defaultChecked id='flexSwitchCheckDefault' label='Online Transactions'/> : <MDBSwitch id='flexSwitchCheckDefault' label='Online Transactions'/>
        }
           
      </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      </div>



        </MDBTabsPane>
        <MDBTabsPane show={justifyActive === 'tab3'}>
        <div className='d-flex justify-content-center'>
        <MDBContainer className="container py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol md="12" xl="8">
            <MDBCard style={{ borderRadius: '15px' }}>
              <MDBCardBody className="text-center">
              <MDBListGroup style={{ minWidthL: '22rem' }} light>
              {statement.map(transaction => 
  <MDBListGroupItem>
        <MDBRow>
          <MDBCol xl='3'>
              {transaction.date}
          </MDBCol>
          <MDBCol xl='6'>
              {transaction.desc}
          </MDBCol>
          <MDBCol xl='3'>
              {transaction.amount} €
              { (transaction.type === 'Dr') ? <span style={{color:'red'}}> Dr</span> : <span style={{color:'green'}}> Cr</span>}
          </MDBCol>
        </MDBRow>
      </MDBListGroupItem>
)}
        </MDBListGroup>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      </div>



        

        </MDBTabsPane>
      </MDBTabsContent>
      </MDBContainer>
}
      </>
  );
}

