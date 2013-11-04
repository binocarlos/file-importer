var template = require('./template');
var Dropzone = require('dropzone');

$digger.directive('fileImporter', function($http, $safeApply){
	return {
    restrict:'EA',
    template:template,
    replace:true,
    controller:function($scope){

			
    },

    link:function($scope, elem, $attrs){

      $scope.uploadid = $digger.littleid();
      $scope.uploadurl = $digger.config.diggerurl + '/reception/files/import'

      if($scope.readonly){
        
      }
      else{


        var myDropzone = new Dropzone(elem.get(0), {
          url: $digger.config.diggerurl + '/reception/files/import',
          uploadMultiple:false,
          addRemoveLinks:true,
          clickable:true,
          init: function() {
            this.on("sending", function(file, xhr, formdata){
              formdata.append('containerid', $scope.container.diggerid());
              formdata.append('warehouse', $scope.container.diggerwarehouse());
            })
            this.on("removedfile", function(file){
              $scope.$emit('file-importer:removed', file);
            })
            this.on("complete", function(file) {
              this.removeFile(file);
            });
            this.on("success", function(file, responseData) {

              responseData.models = responseData.models.map(function(model){
                if(model.src){
                  model.src = $digger.config.diggerurl + '/reception/files' + model.src;
                }
                return model;
              })
              
              $scope.$emit('file-importer:imported', file, responseData);
              /*
              $safeApply($scope, function(){
                $scope.model[$scope.fieldname] = $scope.fileurl = $digger.config.baseurl + '/reception/files' + responseText;
                $scope.processfieldname();
              })
              */
            });
          }
        });

        $scope.$on('file:importer:reset', function(){
          myDropzone.removeAllFiles()
        })
      }
    	
    }
  }
})

Dropzone.autoDiscover = false;
module.exports = '<file-importer />';
