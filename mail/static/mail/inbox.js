document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  //document.querySelector('#link').addEventListener('click', () => email('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit= compose_mail;
  //document.querySelector('#archive').addEventListener('click', ())
  // By default, load the inbox
  load_mailbox('inbox');
});


function compose_email() {
const recipients=document.querySelector('#compose-recipients')
  // Show compose view and hide other views
 recipients.value=email.sender
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}
// function mailbox(){
//   document.querySelectorAll('.button').forEach(b=>{b.onclick=load_mailbox(b.id)})
function reply(id){
  fetch(`/emails/${id}`).then(response=>response.json()).then(email=>{
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#mail').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
    const recipients=document.querySelector('#compose-recipients');
    const subject= document.querySelector('#compose-subject');
    const body=document.querySelector('#compose-body');
    subject.value =`Re: ${email.subject}`;
    recipients.value=`${email.sender}`;

    body.value=`\n\n\n\n --------------------------------------- \n
On ${email.timestamp} ${email.sender} said '${email.body}'`
    document.querySelector('#submit-form').onclick= ()=>{
      fetch('/emails',
        { method:'POST',
        body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body })
      }).then(response=>response.json()).then(
      mail=>{
        if (mail['error'])
        {
          document.querySelector('#msg').innerHTML=mail['error']
        }
        else {
          load_mailbox('sent') }
        } 
        )}
      return false;
    })
}


function archive(mail_id){
  fetch(`/emails/${mail_id}`).then(response=>response.json()).then(email=>{
    if (email.archived!==true){
    
      fetch(`/emails/${mail_id}`,{method: 'PUT', body: JSON.stringify({archived:true})})}
      //document.querySelector('#archive').innerHTML='Archive'};
      else {
       fetch(`/emails/${mail_id}`,{method: 'PUT', body: JSON.stringify({archived:false})});

       load_mailbox('inbox')}
  })
}

function email(mail_id){

 document.querySelector('#emails-view').style.display = 'none';
 document.querySelector('#compose-view').style.display = 'none';
 document.querySelector('#mail').style.display='block';

 fetch(`/emails/${mail_id}`).then(response=>response.json()).then(email=>{

  
  mail=document.querySelector('#mail');
 
    if (email.archived!==true){
  mail.innerHTML=`<h3><b>${email.subject}</b></h3><br>
  <div class='d-flex justify-content-between'>
  <div>From: <b>${email.sender}</b></div>
  <div>${email.timestamp}</div>
  </div>
  <p> To:<b> ${email.recipients}</b></p>
  
  <p>Subject: <b>${email.subject}</b></p>
  <p><button class="btn btn-sm btn-outline-danger" onclick="javascript:archive(${email.id})" id="archive"><i class="fa fa-archive" aria-hidden="true"></i>
Archive</button></p>
  <p><button class="btn btn-sm btn-outline-danger" id='reply' onclick = "reply(${email.id})"><i class="fa fa-reply" aria-hidden="true"></i>Reply</button></p> 
   <p><b>${email.body}</b></p>`}
      
      else {
         mail.innerHTML=`<h3><b>${email.subject}</b></h3><br>
  <div class='d-flex justify-content-between'>
  <div>From: <b>${email.sender}</b></div>
  <div>${email.timestamp}</div>
  </div>
  <p> To:<b> ${email.recipients}</b></p>
  
  <p>Subject: <b>${email.subject}</b></p>
  <p><button class="btn btn-sm btn-outline-danger" onclick="javascript:archive(${email.id})" id="archive"><i class="fa fa-archive" aria-hidden="true"></i>
Unarchive</button></p>
  <p><button class="btn btn-sm btn-outline-danger" id='reply' onclick = "reply(${email.id})"><i class="fa fa-reply" aria-hidden="true"></i>Reply</button></p> 
   <p><b>${email.body}</b></p>`
  
      }
      fetch(`/emails/${mail_id}`,{method: 'PUT', body: JSON.stringify({read:true})});
    })}
      

 function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mail').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<b><h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}<hr></h3></b>`;

  fetch(`/emails/${mailbox}`).then(response=>response.json()).then((msgs)=> {
    if(msgs['error'])
      {document.querySelector('#msg').innerHTML=msg['error']}
    else{
      msgs.forEach(msg=>
        {const element1= document.createElement('a');
        const element2= document.createElement('div');
        element1.href=`javascript:email(${msg.id})`;
        element1.className="link text-decoration-none text-dark" ;
        //element1.class="text-decoration-none";
        //element1.onclick=email(msg.id);
        element2.innerHTML=`<div class='d-flex justify-content-between'><div>${msg.sender}</div>
        <div>${msg.subject}</div>  <div>${msg.timestamp}</div> </div> <hr>` ;
        element1.append(element2);
        document.querySelector('#emails-view').append(element1);
        if (msg.read==false)
          {element2.style.backgroundColor='#DDDDDD'}})}
    });

}
function compose_mail()
{
  const recipients=document.querySelector('#compose-recipients').value;
  const subject=document.querySelector('#compose-subject').value;
  const body=document.querySelector('#compose-body').value;

  fetch('/emails',
    { method:'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body})
  }).then(response=>response.json()).then(
  mail=>{
    if (mail['error'])
    {
      document.querySelector('#msg').innerHTML=mail['error']
    }
    else {
      load_mailbox('sent') 

    }
  }

  );

//console.log(recipients);
return false;
}


