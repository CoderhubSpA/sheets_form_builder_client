<?php

namespace paupololi\sheetsformbuilder\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use GuzzleHttp\Client as GuzzleClient;

use Validator;


class SheetsController extends Controller
{
	public function __construct(Request $request)
    {
        if (env('SHEETS_EXTERNAL')) {
            $this->headers = [
                'Content-Type' => 'application/json',
                'AccessToken' => 'key',
                'Authorization' => env('SECURITY_BEARER'),
            ];

            $this->clientBuilder = [
                'headers' => $this->headers,
                'http_errors' => false,
                'verify' => false,
                'base_uri' => env('SHEETS_API_URL'),
            ];
        }
        else {
            $this->clientBuilder = [
                'http_errors' => false,
                'verify' => false,
                'base_uri' => env('APP_URL'),
            ];
        }
    }
	
    public function index($id)
    {
        $method = 'get';
        $baseUrl = env('SHEETS_API_URL') . 'form/' . $id;
        $response = null;
		$headers = [
            'Content-Type' => 'application/json',
            'AccessToken' => 'key',
            'Authorization' => env('SECURITY_BEARER'),
        ];
	   
		if (!env('SHEETS_EXTERNAL')) {
            $headers = collect($request->header())->transform(function ($item) {
                return $item[0];
            });

            $this->clientBuilder['headers'] = $headers->toArray();
        }
		
        $client = new GuzzleClient([
            'headers' => $headers,
            'http_errors' => false,
            'verify' => false
        ]);
        $r = $client->request($method, $baseUrl);
        $response = $r->getBody()->getContents();
        return $response;
    }

    public function getrecord($entityname,$recordid)
    {
        $method = 'get';
        $baseUrl = env('SHEETS_API_URL') . 'entity/data/' . $entityname . '/' . $recordid;
        $response = null;
		$headers = [
            'Content-Type' => 'application/json',
            'AccessToken' => 'key',
            'Authorization' => env('SECURITY_BEARER'),
        ];
        		
		 if (!env('SHEETS_EXTERNAL')) {
            $headers = collect($request->header())->transform(function ($item) {
                return $item[0];
            });

            $this->clientBuilder['headers'] = $headers->toArray();
        }
		
        $client = new GuzzleClient([
            'headers' => $headers,
            'http_errors' => false,
            'verify' => false
        ]);
        $r = $client->request($method, $baseUrl);
        $response = $r->getBody()->getContents();
        return $response;
    }

    public function saveFile(Request $request)
    {
        try {
            $id = $request->fileId;

            $file = $request->file('file');
            $name = $file->getClientOriginalName();

            $file->move(storage_path('app'), $name);

            $path =  storage_path('app')."/{$name}";

            $method = 'POST';
            $baseUrl = env('SHEETS_API_URL') . 'document';

            $headers = [
                'AccessToken' => 'key',
                'Authorization' => env('SECURITY_BEARER'),
                "Content-Type" => "multipart/form-data"
            ];

            $client = new GuzzleClient([
                'headers' => $headers,
                'http_errors' => false,
                'verify' => false
            ]);

            $r = $client->request($method, $baseUrl, [
                'multipart' => [
                    [
                        'contents' => file_get_contents($path),
                        'name' => 'file',
                        'filename' => $name
                    ]
                ]
            ]);
            $status = $r->getStatusCode();
            $response = $r->getBody()->getContents();
            if($status === 200){
                return response()->json(['success' => true, 'content' => $response]);
            }else{
                return response()->json(['success' => false, 'content' => json_decode($response)]);
            }
            return response()->json(json_decode($response->getBody()->getContents()));
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'content' => $th->getMessage()]);
        }
    }

    public function sendForm(Request $request)
    {
        try {
            $entity_key = $request->entityKey;
            $entity = new \stdClass();
            $entity->$entity_key = \json_decode($request->$entity_key);
            $method = 'post';
            $baseUrl = env('SHEETS_API_URL') . 'entity';
            $response = null;
            $headers = [
                'Content-Type' => 'application/json',
                'AccessToken' => 'key',
                'Authorization' => env('SECURITY_BEARER'),
            ];
            $client = new GuzzleClient([
                'headers' => $headers,
                'http_errors' => false,
                'verify' => false,
                \GuzzleHttp\RequestOptions::JSON => $entity,
            ]);
            $r = $client->request($method, $baseUrl);
            $status = $r->getStatusCode();
            $response = $r->getBody()->getContents();
            if($status === 200){
                return response()->json(['success' => true, 'content' => $response]);
            }else{
                return response()->json(['success' => false, 'content' => json_decode($response), 'status'=> $status]);
            }
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'content' => json_encode($th->getMessage())]);
        }
    }

    public function sendFormUpdate(Request $request)
    {
        try {
            $entity_key = $request->entityKey;
            $entity = new \stdClass();
            $entity->$entity_key = \json_decode($request->$entity_key);
            $method = 'post';
            $baseUrl = env('SHEETS_API_URL') . 'entity';
            $response = null;
            $headers = [
                'Content-Type' => 'application/json',
                'AccessToken' => 'key',
                'Authorization' => env('SECURITY_BEARER'),
            ];
            // return response()->json(['success' => false, 'content' => [\GuzzleHttp\RequestOptions::JSON => $entity]]);
            $client = new GuzzleClient([
                'headers' => $headers,
                'verify' => false,
                'http_errors' => false,
                \GuzzleHttp\RequestOptions::JSON => $entity,
            ]);
            $r = $client->request($method, $baseUrl);
            $status = $r->getStatusCode();
            $response = $r->getBody()->getContents();
            if($status === 200){
                return response()->json(['success' => true, 'content' => $response]);
            }else{
                return response()->json(['success' => false, 'content' => json_decode($response)]);
            }
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'content' => $th->getMessage()]);
        }
    }

    public function entity_info($id)
    {
        $endpoint = env('SHEETS_API_URL') . "entity/info/{$id}";
        $headers = [
            'Content-Type' => 'application/json',
            'AccessToken' => 'key',
            'Authorization' => env('SECURITY_BEARER'),
        ];
        $client = new GuzzleClient([
            'headers' => $headers,
            'http_errors' => false,
            'verify' => false,
        ]);

        $res = $client->request('GET', $endpoint);
        return response()->json([
            'success' => true,
            'content' => $res->getBody()->getContents()
        ]);
    }
}
