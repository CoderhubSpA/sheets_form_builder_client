<?php

namespace  paupololi\sheetsformbuilder\Http\Controllers\API;

use paupololi\sheetsformbuilder\Http\Controllers\Controller;
use Illuminate\Http\Request;
use GuzzleHttp\Client as GuzzleClient;

use Validator;

class SheetsController extends Controller
{
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
        $client = new GuzzleClient([
            'headers' => $headers,
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
                'verify' => false
            ]);

            $response = $client->request($method, $baseUrl, [
                'multipart' => [
                    [
                        'contents' => file_get_contents($path),
                        'name' => 'file',
                        'filename' => $name
                    ]
                ]
            ]);

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
                'verify' => false,
                \GuzzleHttp\RequestOptions::JSON => $entity,
            ]);
            $r = $client->request($method, $baseUrl);
            $response = $r->getBody()->getContents();
            return response()->json(['success' => true, 'content' => $response]);
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
            'verify' => false,
        ]);

        $res = $client->request('GET', $endpoint);
        return response()->json([
            'success' => true,
            'content' => $res->getBody()->getContents()
        ]);
    }
}
