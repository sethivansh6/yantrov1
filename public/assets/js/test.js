let test;
fetch('/gettestdata')
            .then(response => response.json())
            .then(test => {
              
              test=test;

                });


  let questions=test.questions;