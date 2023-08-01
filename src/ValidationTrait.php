<?php

namespace app;

trait ValidationTrait
{
    private $errors;

    public function validate($data, $rules)
    {
       
        foreach($rules as $attribute => $rules) {
            
            foreach($rules as $rule) {
                if($rule['name'] == 'required') {
                    if(!array_key_exists($attribute, $data)) {
                        $this->errors[$attribute] = sprintf('%s is required', $attribute);
                        continue;
                    }
        
                    if( empty($data[$attribute]) ) {
                        $this->errors[$attribute] = sprintf('%s can not be empty', $attribute);
                    }
                }

                if($rule['name'] == 'if_not_exist') {
                    if( is_callable($rule['checker']) ) {
                        $attribute_value = $data[$attribute];
                        $output = call_user_func($rule['checker'], $attribute_value);

                        if($output === false) {
                            $this->errors[$attribute] = sprintf('no item exist with this %s', $attribute);
                        }
                    }
                }

                if($rule['name'] == 'custom') {
                    if( is_callable($rule['checker']) ) {
                        $attribute_value = $data[$attribute];
                        $output = call_user_func($rule['checker'], $attribute_value);

                        if($output !== true) {
                            $this->errors[$attribute] = $output;
                        }
                    }
                }
            }
        }

        return empty($this->errors) ? true : false;
    }

    public function getErrors()
    {
        return $this->errors;
    }
}